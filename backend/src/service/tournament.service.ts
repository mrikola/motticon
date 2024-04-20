import { Brackets, DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Tournament } from "../entity/Tournament";
import { partition, round } from "lodash";
import {
  DraftPodGenerationStrategy,
  PreferencesByPlayer,
} from "../dto/tournaments.dto";
import { Round } from "../entity/Round";
import { Draft } from "../entity/Draft";
import { MatchService } from "./match.service";
import { Cube } from "../entity/Cube";
import { DraftPod } from "../entity/DraftPod";
import { CubeService } from "./cube.service";
import { User } from "../entity/User";
import { DraftPodSeat } from "../entity/DraftPodSeat";
import { RatingService } from "./rating.service";
import { Match } from "../entity/Match";
import { ScoreService } from "./score.service";
import { PlayerTournamentScore } from "../entity/PlayerTournamentScore";
import { LRUCache } from "lru-cache";
import { PreferenceService } from "./preference.service";
import { randomize } from "../util/random";
import { makeArray } from "../util/array";
import { Preference } from "../entity/Preference";
import { playerToDto } from "../dto/user.dto";
import { Enrollment } from "../entity/Enrollment";
import { UserService } from "./user.service";
import {
  WILD_CARD_IDENTIFIER,
  alternateGeneratePodAssignments,
} from "./anoterGreedyAlgorithm";

type PreferentialPodAssignments = {
  preferencePoints: number;
  penaltyPoints: number;
  penaltyReasons: string[];
  strategy: DraftPodGenerationStrategy[];
  assignments: {
    draftNumber: number;
    pods: {
      cube: Cube;
      players: User[];
    }[];
  }[];
};

export class TournamentService {
  private appDataSource: DataSource;
  private repository: Repository<Tournament>;
  private preferenceService: PreferenceService;
  private matchService: MatchService;
  private cubeService: CubeService;
  private ratingService: RatingService;
  private scoreService: ScoreService;
  private userService: UserService;
  private tournamentCache: LRUCache<number, Tournament>;
  private userMatchCache: LRUCache<string, Match>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Tournament);
    this.preferenceService = new PreferenceService();
    this.matchService = new MatchService();
    this.cubeService = new CubeService();
    this.ratingService = new RatingService();
    this.scoreService = new ScoreService();
    this.userService = new UserService();
    this.tournamentCache = new LRUCache({
      ttl: 1000 * 10,
      ttlAutopurge: true,
    });
    this.userMatchCache = new LRUCache({
      ttl: 1000 * 10,
      ttlAutopurge: true,
    });
  }

  async createTournament(
    name: string,
    description: string,
    price: number,
    players: number,
    drafts: number,
    preferencesRequired: number,
    startDate: Date,
    endDate: Date,
    cubeIds: number[],
    userEnrollmentEnabled: boolean
  ): Promise<Tournament> {
    const cubes: Cube[] = await this.appDataSource
      .getRepository(Cube)
      .createQueryBuilder()
      .whereInIds(cubeIds)
      .getMany();

    const tournament: Tournament = await this.repository.save({
      name,
      description,
      entryFee: price,
      totalSeats: players,
      preferencesRequired,
      startDate,
      endDate,
      cubes,
      userEnrollmentEnabled: userEnrollmentEnabled,
    });

    for (let draftIndex = 0; draftIndex < drafts; ++draftIndex) {
      await this.appDataSource
        .createQueryBuilder()
        .insert()
        .into(Draft)
        .values({
          draftNumber: draftIndex + 1,
          tournament,
          firstRound: draftIndex * 3 + 1,
          lastRound: draftIndex * 3 + 3,
        })
        .execute();
      for (let roundIndex = 0; roundIndex < 3; ++roundIndex) {
        await this.appDataSource
          .createQueryBuilder()
          .insert()
          .into(Round)
          .values({
            roundNumber: draftIndex * 3 + roundIndex + 1,
            tournament,
          })
          .execute();
      }
    }
    return tournament;
  }

  async getAllTournaments(): Promise<Tournament[]> {
    return await this.repository.find();
  }

  async getOngoingTournaments(): Promise<Tournament[]> {
    // temporary hackjob
    const allTournaments = await this.repository.find();

    const today = new Date();
    const [past, notPast] = partition(
      allTournaments,
      (tournament) => tournament.endDate < today
    );
    const [future, ongoing] = partition(
      notPast,
      (tournament) => tournament.startDate > today
    );

    return ongoing;
  }

  async getFutureTournaments(): Promise<Tournament[]> {
    const today = new Date();
    return await this.repository
      .createQueryBuilder("tournament")
      .where("tournament.endDate > :today", { today })
      .getMany();
  }

  async getPastTournaments(): Promise<Tournament[]> {
    const today = new Date();
    return await this.repository
      .createQueryBuilder("tournament")
      .where("tournament.endDate < :today", { today })
      .getMany();
  }

  async getTournament(id: number): Promise<Tournament> {
    const cachedTournament = this.tournamentCache.get(id);
    if (cachedTournament) {
      console.log("get tournament cache hit");
      return cachedTournament;
    }
    const tournament = await this.repository.findOne({
      where: { id },
    });
    this.tournamentCache.set(id, tournament);
    return tournament;
  }

  async getTournamentEnrollments(id: number): Promise<Tournament> {
    return await this.repository
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.enrollments", "enrollments")
      .leftJoinAndSelect("enrollments.player", "player")
      .where("tournament.id = :id", { id })
      .getOne();
  }

  async getTournamentStaff(id: number): Promise<Tournament> {
    return await this.repository
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.staffMembers", "staffMembers")
      .where("tournament.id = :id", { id })
      .getOne();
  }

  async getTournamentAndDrafts(id: number): Promise<Tournament> {
    return await this.repository
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.drafts", "draft")
      .leftJoinAndSelect("draft.pods", "pod")
      .leftJoinAndSelect("pod.cube", "cube")
      .leftJoinAndSelect("pod.seats", "seat")
      .leftJoinAndSelect("seat.player", "player")
      .where("tournament.id = :id", { id })
      .getOne();
  }

  async addToStaff(tournamentId: number, userId: number): Promise<Tournament> {
    const tourny = await this.getTournamentStaff(tournamentId);
    const id = Number(userId);
    if (tourny.staffMembers.some((user) => user.id === id)) {
      // user is already staff
      return tourny;
    } else {
      const user = await this.userService.getUser(id);
      tourny.staffMembers.push(user);
      try {
        await this.repository.save(tourny);
        return await this.getTournamentStaff(tournamentId);
      } catch (err: unknown) {
        return null;
      }
    }
  }

  async removeFromStaff(
    tournamentId: number,
    userId: number
  ): Promise<Tournament> {
    const tourny = await this.getTournamentStaff(tournamentId);
    const id = Number(userId);
    if (tourny.staffMembers.some((u) => u.id === id)) {
      tourny.staffMembers = tourny.staffMembers.filter(function (staff) {
        return staff.id !== id;
      });
      try {
        await this.repository.save(tourny);
        return await this.getTournamentStaff(tournamentId);
      } catch (err: unknown) {
        return null;
      }
    } else {
      // user not in staff
      return tourny;
    }
  }

  async getCurrentRound(tournamentId: number): Promise<Round> {
    return await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .leftJoin("round.tournament", "tournament")
      .where("round.status = 'started'")
      .andWhere("tournament.id = :tournamentId", { tournamentId })
      .orderBy('"roundNumber"', "DESC")
      .getOne();
  }

  async getMostRecentRound(tournamentId: number): Promise<Round> {
    return await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .leftJoin("round.tournament", "tournament")
      .where("round.status = 'completed'")
      .andWhere("tournament.id = :tournamentId", { tournamentId })
      .orderBy('"roundNumber"', "DESC")
      .getOne();
  }

  async getCurrentDraft(tournamentId: number): Promise<Draft> {
    return await this.appDataSource
      .getRepository(Draft)
      .createQueryBuilder("draft")
      .leftJoinAndSelect("draft.pods", "pod")
      .leftJoinAndSelect("pod.seats", "seat")
      .leftJoinAndSelect("seat.pod", "draftPod")
      .leftJoinAndSelect("seat.player", "player")
      .leftJoin("draft.tournament", "tournament")
      .where("draft.status = 'started'")
      .andWhere("tournament.id = :tournamentId", { tournamentId })
      .orderBy('"draftNumber"', "DESC")
      .getOne();
  }

  async getCurrentMatch(userId: number, roundId: number): Promise<Match> {
    const identifier = roundId + "." + userId;
    const cachedMatch = this.userMatchCache.get(identifier);
    if (cachedMatch) {
      console.log("user match cache hit");
      return cachedMatch;
    }
    const match = await this.appDataSource
      .getRepository(Match)
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.round", "round")
      .leftJoinAndSelect("match.resultSubmittedBy", "resultSubmittedUser")
      .leftJoinAndSelect("match.playerGoingFirst", "playerGoingFirst")
      .leftJoinAndSelect("match.player1", "player1")
      .leftJoinAndSelect("match.player2", "player2")
      .where("round.id = :roundId", { roundId })
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('match."player1Id" = :userId', { userId })
            .orWhere('match."player2Id" = :userId', { userId })
        )
      )
      .getOne();
    this.userMatchCache.set(identifier, match);
    return match;
  }

  async startTournament(tournamentId: number): Promise<Tournament> {
    await this.repository
      .createQueryBuilder("tournament")
      .update()
      .set({ status: "started" })
      .where({ id: tournamentId })
      .execute();

    const { enrollments } = await this.getTournamentEnrollments(tournamentId);

    await Promise.all(
      enrollments.map(async (enrollment) => {
        await this.appDataSource
          .getRepository(PlayerTournamentScore)
          .insert({ tournamentId, player: enrollment.player });
      })
    );

    return await this.getTournamentAndDrafts(tournamentId);
  }

  async endTournament(tournamentId: number): Promise<Tournament> {
    await this.repository
      .createQueryBuilder("tournament")
      .update()
      .set({ status: "completed" })
      .where({ id: tournamentId })
      .execute();

    return await this.getTournamentAndDrafts(tournamentId);
  }

  async generateDraftSeatings(
    pods: DraftPod[],
    players: User[]
  ): Promise<void> {
    pods.forEach((pod, podIndex) => {
      const podPlayers = players
        .slice(podIndex * 8, (podIndex + 1) * 8)
        .sort(randomize);
      podPlayers.forEach(async (player, playerIndex) => {
        await this.appDataSource.getRepository(DraftPodSeat).insert({
          pod,
          seat: playerIndex + 1,
          player,
          draftPoolReturned: false,
        });
      });
    });
  }

  async generateDrafts(tournamentId: number): Promise<Tournament> {
    const tournament = await this.getTournamentAndDrafts(tournamentId);
    const enrollments = (await this.getTournamentEnrollments(tournamentId))
      .enrollments;
    const cubes = await this.cubeService.getCubesForTournament(tournamentId);
    const podsPerDraft = tournament.totalSeats / 8;

    if (tournament.preferencesRequired === 0) {
      // TODO for non-preference cases, this just randomizes players and cubes + assigns them afterwards
      // better algorithms suggested and required for production use

      const players = enrollments.map((enr) => enr.player).sort(randomize);
      const sortedCubes = cubes.sort(randomize);

      if (players.length !== tournament.totalSeats) {
        console.log("not all seats will be filled");
      }
      if (sortedCubes.length < podsPerDraft) {
        console.log("not enough cubes for all draft pods");
      }

      await Promise.all(
        tournament.drafts.map(async (draft) => {
          const draftPods: DraftPod[] = [];
          for (let index = 0; index < podsPerDraft; ++index) {
            draftPods.push(
              await this.appDataSource.getRepository(DraftPod).save({
                podNumber: index + 1,
                draft,
                cube: sortedCubes[index],
              })
            );
          }
          await this.generateDraftSeatings(draftPods, players);
        })
      );
    } else {
      const assignments = await this.getPreferentialPodAssignments(
        tournamentId
      );
      tournament.drafts.map(async (draft) => {
        const assignment = assignments.find(
          (ass) => ass.draftNumber === draft.draftNumber
        );
        const draftPods = await Promise.all(
          assignment.pods.map(
            async (pod, index) =>
              await this.appDataSource.getRepository(DraftPod).save({
                podNumber: index + 1,
                draft,
                cube: pod.cube,
              })
          )
        );
        await this.generateDraftSeatings(
          draftPods,
          assignment.pods.map((pod) => pod.players).flat()
        );
      });
    }

    return await this.getTournamentAndDrafts(tournamentId);
  }

  // is called after pairings have been generated, before round timer starts
  async initiateDraft(tournamentId: number, draftId: number): Promise<Draft> {
    await this.appDataSource
      .getRepository(Draft)
      .createQueryBuilder("draft")
      .update()
      .set({ status: "started" })
      .where({ id: draftId })
      .execute();

    return await this.getCurrentDraft(tournamentId);
  }

  async startDraft(tournamentId: number, draftId: number): Promise<Draft> {
    await this.appDataSource
      .getRepository(Draft)
      .createQueryBuilder("draft")
      .update()
      .set({ startTime: new Date() })
      .where({ id: draftId })
      .execute();

    return await this.getCurrentDraft(tournamentId);
  }

  async endDraft(tournamentId: number, draftId: number): Promise<Tournament> {
    await this.appDataSource
      .getRepository(Draft)
      .createQueryBuilder("draft")
      .update()
      .set({ status: "completed" })
      .where({ id: draftId })
      .execute();

    return await this.getTournamentAndDrafts(tournamentId);
  }

  // is called after pairings have been generated, before round timer starts
  async initiateRound(tournamentId: number, roundId: number): Promise<Round> {
    await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .update()
      .set({ status: "started" })
      .where({ id: roundId })
      .execute();

    return await this.getCurrentRound(tournamentId);
  }

  // starts the round timer
  async startRound(tournamentId: number, roundId: number): Promise<Round> {
    await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .update()
      .set({ startTime: new Date() })
      .where({ id: roundId })
      .execute();

    return await this.getCurrentRound(tournamentId);
  }

  async endRound(tournamentId: number, roundId: number): Promise<Round> {
    const round = await this.getCurrentRound(tournamentId);
    await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .update()
      .set({ status: "completed" })
      .where({ id: roundId })
      .execute();

    // run updateElo() for all matches at this point
    const matches = await this.matchService.getMatchesForRound(roundId);
    const kvalue = 8;
    console.log(matches);
    await Promise.all(
      matches.map(async (match) => {
        const { player1, player2 } = match;
        const winnerId =
          match.player1GamesWon === match.player2GamesWon
            ? 0
            : match.player1GamesWon > match.player2GamesWon
            ? player1.id
            : player2.id;

        if (winnerId !== 0) {
          await this.scoreService.awardMatchWin(tournamentId, winnerId);

          if (match.matchType === "final") {
            await this.scoreService.awardDraftWin(tournamentId, winnerId);
          }
        } else {
          await this.scoreService.awardDraw(
            tournamentId,
            player1.id,
            player2.id
          );
        }

        this.ratingService.updateElo(kvalue, player1.id, player2.id, winnerId);
      })
    );

    this.scoreService.saveSnapshot(tournamentId, round.roundNumber);
    return null;
  }

  // todo: for testing use only
  async getPreferences(tournamentId: number): Promise<Preference[]> {
    return await this.preferenceService.getPreferencesForTournament(
      tournamentId
    );
  }

  async getPreferencesForUser(
    tournamentId: number,
    userId: number
  ): Promise<Preference[]> {
    return await this.preferenceService.getPreferencesForTournamentAndUser(
      tournamentId,
      userId
    );
  }

  getAssetsForAssignments = async (tournamentId: number) => {
    const tournament = await this.getTournamentAndDrafts(tournamentId);
    const enrollments = (await this.getTournamentEnrollments(tournamentId))
      .enrollments;
    const cubes = await this.cubeService.getCubesForTournament(tournamentId);
    const podsPerDraft = tournament.totalSeats / 8;

    const preferences =
      await this.preferenceService.getPreferencesForTournament(tournamentId);
    return { tournament, enrollments, cubes, podsPerDraft, preferences };
  };

  getPlayerPreferencesForPodGeneration = (
    preferences: Preference[],
    enrollments: Enrollment[]
  ) => {
    let preferencesByPlayer = {};
    preferences.forEach((preference) => {
      if (
        enrollments.find((enroll) => enroll.player.id === preference.player.id)
      ) {
        let currentPlayerPreference = preferencesByPlayer[preference.player.id];
        const pref = {
          player: preference.playerId,
          cube: preference.cube.id,
          points: preference.points,
          used: false,
        };

        if (!currentPlayerPreference) {
          preferencesByPlayer[preference.player.id] = [pref];
        } else {
          currentPlayerPreference.push(pref);
        }
      }
    });
    return preferencesByPlayer;
  };

  getCubeIndexForStrategy = (
    strategy: DraftPodGenerationStrategy[],
    draftIndex: number,
    podsPerDraft: number,
    podNumber: number
  ) => {
    switch (strategy[draftIndex]) {
      case "greedy":
        return 0; // for greedy strategy, take the most popular cube available
      case "semi-greedy":
        return 1; // for semi-greedy strategy, take the second most popular cube available
      // Begin adding jitter to the permutations
      case "third":
        return 2;
      case "fourth":
        return 3;
      case "fifth":
        return 4;
      case "sixth":
        return 5;
      case "seventh":
        return 6;
      // End adding jitter to the permutations
      case "sparing":
        return podsPerDraft - podNumber; // for sparing strategy, take the Nth most popular where N is pods to be generated
      case "middle":
        return Math.floor((podsPerDraft - podNumber) / 2); // for middle strategy, take the of the two above
      default:
        throw new Error("invalid strategy");
    }
  };

  getOverwhelmingFavoriteIfExists = (
    cubes: { id: number; points: number }[]
  ) => {
    // use this half the time
    if (cubes[0].points > cubes[1].points + 55) {
      return 0;
    }
    return undefined;
  };

  resolvePodGenerationStrategy = async (
    iterationsPerStrategy: number,
    strategy: DraftPodGenerationStrategy[],
    preferences: Preference[],
    tournament: Tournament,
    podsPerDraft: number,
    enrollments: Enrollment[],
    cubes: Cube[]
  ): Promise<PreferentialPodAssignments[]> => {
    const podAssignments: PreferentialPodAssignments[] = [];
    for (let iteration = 0; iteration < iterationsPerStrategy; ++iteration) {
      // SET UP FOR A PARTICULAR ITERATION
      const preferencesByPlayer: PreferencesByPlayer =
        this.getPlayerPreferencesForPodGeneration(preferences, enrollments);

      const useOverwhelmingOverride = Math.random() > 0.5;

      const wildCardAssignments: {
        [key: number]: number[];
      } = {};

      let totalPreferencePointsUsed = 0;

      const assignments: User[][][] = makeArray(
        tournament.drafts.length,
        podsPerDraft,
        8
      );

      let currentIterationAssignments: PreferentialPodAssignments = {
        preferencePoints: 0,
        penaltyPoints: 0,
        penaltyReasons: [],
        assignments: [],
        strategy,
      };

      let draftIndex = 0;
      for (let draft of tournament.drafts.sort(
        (a, b) => a.draftNumber - b.draftNumber
      )) {
        let preferencePointsUsed = 0;
        let unassignedPlayers = enrollments.map((enroll) => enroll.player);
        const draftPods: {
          cube: Cube;
          podNumber: number;
        }[] = [];

        let wildCards = unassignedPlayers
          .filter(
            (player) =>
              !player.isDummy &&
              (!preferencesByPlayer[player.id] ||
                preferencesByPlayer[player.id].filter((pref) => !pref.used)
                  .length === 0)
          )
          .sort(randomize);

        const dummyPlayers = unassignedPlayers
          .filter((player) => player.isDummy)
          .sort(randomize);
        const dummyPlayerCount = dummyPlayers.length;

        let isGreedyOverride = false;

        for (let podNumber = 1; podNumber <= podsPerDraft; ++podNumber) {
          const cubesByPreference = cubes
            // filter out cubes already used in this draft
            .filter((cube) => !draftPods.find((pod) => pod.cube.id === cube.id))
            .map((cube) => ({
              id: cube.id,
              points: preferences
                .filter(
                  (pref) =>
                    pref.cube.id === cube.id &&
                    !preferencesByPlayer[pref.player.id].find(
                      (x) => x.cube === cube.id
                    )?.used
                )
                .reduce((acc, cur) => acc + cur.points, 0),
            }))
            .sort((a, b) => b.points - a.points);

          const regularCubeIndex = this.getCubeIndexForStrategy(
            strategy,
            draftIndex,
            podsPerDraft,
            podNumber
          );

          const cubeIndex =
            (podNumber === 1 && useOverwhelmingOverride
              ? this.getOverwhelmingFavoriteIfExists(cubesByPreference)
              : undefined) ?? regularCubeIndex;

          isGreedyOverride ||= cubeIndex !== regularCubeIndex;

          // console.info(cubesByPreference, strategy);
          const currentCubeId = cubesByPreference[cubeIndex].id;

          const shouldAssignExtraDummy =
            strategy[draftIndex] === "greedy"
              ? // with greedy strat, put dummies in last pods
                dummyPlayerCount % podsPerDraft > podsPerDraft - podNumber
              : // otherwise, if override is on, pods 2..n; if not, pods 1..n
                !(isGreedyOverride && podNumber === 1) &&
                dummyPlayerCount % podsPerDraft >=
                  podNumber - (isGreedyOverride ? 1 : 0);

          const dummyPlayersInPod =
            Math.floor(dummyPlayerCount / podsPerDraft) +
            (shouldAssignExtraDummy ? 1 : 0);

          const preferredPlayers = preferences // find players who..
            .filter(
              (pref) => !pref.player.isDummy && pref.cube.id === currentCubeId // want to play this cube
            )
            .sort(randomize)
            .sort((a, b) => b.points - a.points) // have rated it highly
            .filter(
              // have not already been assigned to play it in an earlier draft
              (pref) =>
                !preferencesByPlayer[pref.player.id].find(
                  (x) => x.cube === currentCubeId
                )?.used
            )
            .filter(
              (
                pref // and have not been assigned to a different cube in this draft
              ) =>
                unassignedPlayers.find((player) => player.id === pref.player.id)
            )
            .slice(0, 8 - dummyPlayersInPod)
            .map((pref) => {
              preferencePointsUsed += pref.points;
              return pref;
            })
            .map((pref) => pref.player);

          for (let dummy = 0; dummy < dummyPlayersInPod; ++dummy) {
            const dummyPlayer = dummyPlayers.pop();
            preferredPlayers.push(dummyPlayer);

            // mark this as a wildcard assignment as dummy players don't have preferences
            wildCardAssignments[dummyPlayer.id] = wildCardAssignments[
              dummyPlayer.id
            ]
              ? wildCardAssignments[dummyPlayer.id].concat(currentCubeId)
              : [currentCubeId];
          }

          // if pod is not full, fill it with wildcards
          while (preferredPlayers.length < 8 && wildCards.length > 0) {
            // check that the wildcard hasn't played this cube earlier
            const assigned = wildCards
              .filter(
                (wc) =>
                  !(wildCardAssignments[wc.id] ?? []).includes(currentCubeId)
              )
              .pop();

            if (!assigned && wildCards.length > 0) {
              // console.log("can't assign wildcard");
              break;
            }

            if (assigned) {
              preferredPlayers.push(assigned);
              wildCards = wildCards.filter((p) => p.id !== assigned.id);
              wildCardAssignments[assigned.id] = wildCardAssignments[
                assigned.id
              ]
                ? wildCardAssignments[assigned.id].concat(currentCubeId)
                : [currentCubeId];
            }
          }

          // if pod is STILL not full, fill it with randoms
          if (preferredPlayers.length < 8) {
            preferredPlayers.push(
              ...unassignedPlayers
                // filter out assigned players for this cube
                .filter(
                  (player) =>
                    !preferredPlayers.find((pp) => pp.id === player.id)
                )
                .filter(
                  // filter out users who have already played this cube
                  (user, _) =>
                    !preferencesByPlayer[user.id]?.find(
                      (x) => x.cube === currentCubeId
                    )?.used ||
                    !(wildCardAssignments[user.id] ?? []).includes(
                      currentCubeId
                    )
                )
                .slice(0, 8 - preferredPlayers.length)
            );
          }

          if (preferredPlayers.length < 8) {
            console.log(
              "pod not full, could only fit: ",
              preferredPlayers.length
            );
            console.info(currentCubeId);
            throw new Error("pod not full");
          }

          assignments[draftIndex][podNumber - 1] = preferredPlayers;

          // clear assigned players from the unassigned list for this draft
          unassignedPlayers = unassignedPlayers.filter(
            (player) => !preferredPlayers.find((pp) => pp.id === player.id)
          );

          // and take this cube away from their preferences
          preferredPlayers.forEach((pp) => {
            if (preferencesByPlayer[pp.id]) {
              const pref = preferencesByPlayer[pp.id].find(
                (pref) => pref.cube === currentCubeId
              );
              if (pref) pref.used = true;
            } else {
              wildCardAssignments[pp.id] = wildCardAssignments[pp.id]
                ? wildCardAssignments[pp.id].concat(currentCubeId)
                : [currentCubeId];
            }
          });

          draftPods.push({
            podNumber,
            cube: cubes.find((cube) => cube.id === currentCubeId),
          });
        }

        console.log("Preference points used", preferencePointsUsed);

        currentIterationAssignments.preferencePoints += preferencePointsUsed;
        currentIterationAssignments.assignments.push({
          draftNumber: draft.draftNumber,
          pods: draftPods.map((pod) => ({
            cube: pod.cube,
            players: assignments[draftIndex][pod.podNumber - 1],
          })),
        });

        totalPreferencePointsUsed += preferencePointsUsed;
        draftIndex++;
      }
      podAssignments.push(currentIterationAssignments);
      console.log("Used strategy:", strategy.join(", "));
      console.log("Total preference points used", totalPreferencePointsUsed);
    }
    return podAssignments;
  };

  permutatePodGenerationStrategies = (
    strategies: DraftPodGenerationStrategy[]
  ) => {
    let resultSet: Set<string> = new Set();

    const permute = (
      current: DraftPodGenerationStrategy[],
      accumulator: DraftPodGenerationStrategy[] = []
    ) => {
      if (accumulator.length === 3) {
        resultSet.add(JSON.stringify(accumulator));
      } else {
        for (let i = 0; i < current.length; i++) {
          let curr = current.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), accumulator.concat(next));
        }
      }
    };
    permute(strategies);

    let result: DraftPodGenerationStrategy[][] = [];
    for (let item of resultSet) {
      result.push(JSON.parse(item));
    }
    return result;
  };

  generatePodAssignments = async (
    preferences: Preference[],
    tournament: Tournament,
    podsPerDraft: number,
    enrollments: Enrollment[],
    cubes: Cube[]
  ) => {
    const iterationsPerStrategy = 50;

    const podGenerationStrategies: DraftPodGenerationStrategy[][] =
      this.permutatePodGenerationStrategies([
        "greedy",
        "greedy",
        "greedy",
        "sparing",
        "sparing",
        "sparing",
        "middle",
        "middle",
        "middle",
      ] as DraftPodGenerationStrategy[]);

    console.info("Strategies: ", podGenerationStrategies);

    const podAssigmments = await Promise.all(
      podGenerationStrategies.map(
        async (strategy) =>
          await this.resolvePodGenerationStrategy(
            iterationsPerStrategy,
            strategy,
            preferences,
            tournament,
            podsPerDraft,
            enrollments,
            cubes
          )
      )
    );
    return podAssigmments.flat();
  };

  validatePodAssignments = (
    podAssignments: PreferentialPodAssignments[],
    preferencesByPlayer: PreferencesByPlayer
  ): PreferentialPodAssignments[] => {
    // console.info("Validating pod assignments");

    const validatedPodAssignments = podAssignments.map((assignment) => {
      // Initialize how many times players have played each draft (0 times)
      let playerCounts: { [cubeId: number]: { [playerId: number]: number } } =
        {};
      let penaltyPoints = 0;
      let penaltyReasons: string[] = [];

      // Define the validation function in the closure so we'll have a view of
      // the entire assigments
      const validatePlayerNotInMultipleCubes = (
        pod: { cube: Cube; players: User[] },
        player: User
      ) => {
        if (player.id === WILD_CARD_IDENTIFIER) {
          return;
        }
        if (!playerCounts[pod.cube.id]) {
          playerCounts[pod.cube.id] = { [player.id]: 1 };
        } else {
          if (playerCounts[pod.cube.id][player.id]) {
            playerCounts[pod.cube.id][player.id]++;
            if (playerCounts[pod.cube.id][player.id] > 1) {
              penaltyReasons.push(
                `Player ${player.firstName} ${player.lastName} is on the same cube (${pod.cube.id}) multiple times`
              );
              penaltyPoints += 50;
            }
          } else {
            playerCounts[pod.cube.id] = {
              ...playerCounts[pod.cube.id],
              [player.id]: 1,
            };
          }
        }
      };

      const validatePlayerWithinPreferences = (
        pod: { cube: Cube; players: User[] },
        player: User
      ): boolean => {
        if (player.id === WILD_CARD_IDENTIFIER) {
          return true;
        }
        const playerPreferences = preferencesByPlayer[player.id];
        if (
          playerPreferences &&
          playerPreferences.length === 5 &&
          !playerPreferences
            .map((preference) => preference.cube)
            .includes(pod.cube.id)
        ) {
          penaltyReasons.push(
            `Player ${player.firstName} ${
              player.lastName
            } with 5 preferences (${playerPreferences
              .map((preference) => preference.cube)
              .join(", ")}) is assigned to a cube not in their preferences (${
              pod.cube.id
            })`
          );
          penaltyPoints += 5;
          return false;
        }
        return true;
      };

      /*
      console.info(
        "Validating assignment with preference points:",
        assignment.preferencePoints
      );
      */
      for (let draft of assignment.assignments) {
        for (let pod of draft.pods) {
          let unIntentionalWildcardsUsed = 0;
          for (let player of pod.players) {
            validatePlayerNotInMultipleCubes(pod, player);
            unIntentionalWildcardsUsed += validatePlayerWithinPreferences(
              pod,
              player
            )
              ? 0
              : 1;
          }

          // Check that not too many unintentional wildcards are in use
          if (unIntentionalWildcardsUsed >= 2) {
            penaltyReasons.push(
              `Draft ${draft.draftNumber} cube ${pod.cube.id} has ${unIntentionalWildcardsUsed} unintentional wildcards`
            );
            penaltyPoints += 10 * unIntentionalWildcardsUsed;
          }
        }
      }
      // console.info("Final penalty points of assignment: ", penaltyPoints);
      return {
        ...assignment,
        penaltyPoints,
        penaltyReasons,
      };
    });
    return validatedPodAssignments;
  };
  async getPreferentialPodAssignments(tournamentId: number) {
    const { tournament, enrollments, cubes, podsPerDraft, preferences } =
      await this.getAssetsForAssignments(tournamentId);

    const alternatePodAssignments = await alternateGeneratePodAssignments(
      preferences,
      tournament,
      podsPerDraft,
      enrollments,
      cubes
    );

    const podAssignments = await this.generatePodAssignments(
      preferences,
      tournament,
      podsPerDraft,
      enrollments,
      cubes
    );

    const preferencesByPlayer: PreferencesByPlayer = {};
    preferences.forEach((preference) => {
      let currentPlayerPreference = preferencesByPlayer[preference.player.id];
      const pref = {
        player: preference.player.id,
        cube: preference.cube.id,
        points: preference.points,
        used: false,
      };

      if (!currentPlayerPreference) {
        preferencesByPlayer[preference.player.id] = [pref];
      } else {
        currentPlayerPreference.push(pref);
      }
    });

    const validatedPodAssigments = this.validatePodAssignments(
      alternatePodAssignments,
      preferencesByPlayer
    );

    const sortedAssignments = validatedPodAssigments.sort(
      (a, b) =>
        b.preferencePoints -
        b.penaltyPoints -
        (a.preferencePoints - a.penaltyPoints)
    );

    console.log(
      "points used in each iteration and penalties",
      sortedAssignments.map((assignment) => ({
        points: assignment.preferencePoints,
        penalties: assignment.penaltyPoints,
      }))
    );

    console.log(
      `best assignment with ${sortedAssignments[0].preferencePoints} spent with ${sortedAssignments[0].penaltyPoints} penalty points:`
    );
    console.log("Strategy: ", sortedAssignments[0].strategy.join(", "));
    console.info("Penalties: ", sortedAssignments[0].penaltyReasons);
    sortedAssignments[0].assignments.forEach((assignment) => {
      console.log("DRAFT", assignment.draftNumber);
      assignment.pods.forEach((pod, index) => {
        console.log(
          "POD",
          index + 1,
          "cube",
          pod.cube.id,
          pod.players
            .map(
              (player) =>
                player.firstName +
                " " +
                player.lastName +
                " (" +
                (preferencesByPlayer[player.id]?.find(
                  (pref) => pref.cube == pod.cube.id
                )?.points ?? "W") +
                ")"
            )
            .join(", ")
        );
      });
    });

    return sortedAssignments[0].assignments;
  }
}
