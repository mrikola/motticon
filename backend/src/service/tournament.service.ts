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

type PreferentialPodAssignments = {
  preferencePoints: number;
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
      const podPlayers = players.slice(podIndex * 8, (podIndex + 1) * 8);
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

    let totalPreferencePointsUsed = 0;

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
      console.log(
        "TODO: generate preferential pod assignments, pick the best one and use it"
      );
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
    preferencesByPlayer: PreferencesByPlayer
  ) => {
    preferences.forEach((preference) => {
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
    });
  };

  resolvePodGenerationStrategy = async (
    iterationsPerStrategy: number,
    strategy: DraftPodGenerationStrategy[],
    podAssignments: PreferentialPodAssignments[],
    preferences: Preference[],
    tournament: Tournament,
    podsPerDraft: number,
    enrollments: Enrollment[],
    cubes: Cube[]
  ) => {
    for (let iteration = 0; iteration < iterationsPerStrategy; ++iteration) {
      // SET UP FOR A PARTICULAR ITERATION
      const preferencesByPlayer: PreferencesByPlayer = {};
      this.getPlayerPreferencesForPodGeneration(
        preferences,
        preferencesByPlayer
      );

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
        assignments: [],
      };

      let draftIndex = 0;
      for (let draft of tournament.drafts.sort(
        (a, b) => a.draftNumber - b.draftNumber
      )) {
        let preferencePointsUsed = 0;
        let unassignedPlayers = enrollments.map((enroll) => enroll.player);
        const draftPods: DraftPod[] = [];

        const wildCards = unassignedPlayers
          .filter(
            (player) =>
              !preferencesByPlayer[player.id] ||
              preferencesByPlayer[player.id].filter((pref) => !pref.used)
                .length === 0
          )
          .sort(randomize);

        for (let podNumber = 1; podNumber <= podsPerDraft; ++podNumber) {
          const cubeIndex =
            strategy[draftIndex] === "greedy"
              ? 0 // for greedy strategy, take the most popular cube available
              : podsPerDraft - podNumber; // for sparing strategy, take the Nth most popular where N is pods to be generated

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

          const currentCubeId = cubesByPreference[cubeIndex].id;
          // TODO see if it's possible to use a different cube IF:
          // * draftNumber > 1
          // podNumber = max
          // a previous draft's last pod also used this cube

          const preferredPlayers = preferences // find players who..
            .filter((pref) => pref.cube.id === currentCubeId) // want to play this cube
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
            .slice(0, 8)
            .map((pref) => {
              preferencePointsUsed += pref.points;
              return pref;
            })
            .map((pref) => pref.player);

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
              wildCardAssignments[assigned.id] = wildCardAssignments[
                assigned.id
              ]
                ? wildCardAssignments[assigned.id].concat(currentCubeId)
                : [currentCubeId];
            }
          }

          // if pod is STILL not full, fill it with randoms
          while (preferredPlayers.length < 8) {
            preferredPlayers.push(
              ...unassignedPlayers
                .filter(
                  (player) =>
                    !preferredPlayers.find((pp) => pp.id === player.id)
                )
                // TODO remove players who already played this cube
                .slice(0, 8 - preferredPlayers.length)
            );
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

          const draftPod = await this.appDataSource
            .getRepository(DraftPod)
            .create({
              podNumber,
              draft,
              cube: cubesByPreference[cubeIndex],
            });

          draftPods.push(draftPod);
        }

        /* add nothing to db in this method
        await this.tournamentService.generateDraftSeatings(
          draftPods,
          assignments[draftIndex].flat()
        );
        */

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
      console.log("Total preference points used", totalPreferencePointsUsed);
    }
  };

  generatePodAssignments = async (
    podAssignments: PreferentialPodAssignments[],
    preferences: Preference[],
    tournament: Tournament,
    podsPerDraft: number,
    enrollments: Enrollment[],
    cubes: Cube[]
  ) => {
    const iterationsPerStrategy = 10;

    const podGenerationStrategies: DraftPodGenerationStrategy[][] = [
      ["greedy", "sparing", "sparing"],
      ["greedy", "greedy", "sparing"],
      ["greedy", "greedy", "greedy"],
    ];

    for (const strategy of podGenerationStrategies) {
      await this.resolvePodGenerationStrategy(
        iterationsPerStrategy,
        strategy,
        podAssignments,
        preferences,
        tournament,
        podsPerDraft,
        enrollments,
        cubes
      );
    }
  };

  async getPreferentialPodAssignments(tournamentId: number) {
    const { tournament, enrollments, cubes, podsPerDraft, preferences } =
      await this.getAssetsForAssignments(tournamentId);

    const podAssignments: PreferentialPodAssignments[] = [];

    await this.generatePodAssignments(
      podAssignments,
      preferences,
      tournament,
      podsPerDraft,
      enrollments,
      cubes
    );

    const sortedAssignments = podAssignments.sort(
      (a, b) => b.preferencePoints - a.preferencePoints
    );

    console.log(
      "points used in each iteration",
      sortedAssignments.map((assignment) => assignment.preferencePoints)
    );

    const preferencesByPlayer: PreferencesByPlayer = {};
    preferences.forEach((preference) => {
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
    });

    console.log(
      `best assignment with ${sortedAssignments[0].preferencePoints} spent:`
    );
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
  }
}
