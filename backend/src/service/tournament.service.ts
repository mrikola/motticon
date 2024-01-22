import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Tournament } from "../entity/Tournament";
import { partition, round } from "lodash";
import { TournamentsByType } from "../dto/tournaments.dto";
import { Round } from "../entity/Round";
import { Draft } from "../entity/Draft";
import { MatchService } from "./match.service";
import { Cube } from "../entity/Cube";
import { Enrollment } from "../entity/Enrollment";
import { DraftPod } from "../entity/DraftPod";
import { CubeService } from "./cube.service";
import { User } from "../entity/User";
import { DraftPodSeat } from "../entity/DraftPodSeat";

export class TournamentService {
  private appDataSource: DataSource;
  private repository: Repository<Tournament>;
  private matchService: MatchService;
  private cubeService: CubeService;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Tournament);
    this.matchService = new MatchService();
    this.cubeService = new CubeService();
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
    cubeIds: number[]
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

  async getAllTournaments(): Promise<TournamentsByType> {
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

    return {
      past,
      ongoing,
      future,
    };
  }

  async getOngoingTournaments(): Promise<any> {
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

  async getFutureTournaments(): Promise<any> {
    const today = new Date();
    return await this.repository
      .createQueryBuilder("tournament")
      .where("tournament.endDate > :today", { today })
      .getMany();
  }

  async getPastTournaments(): Promise<any> {
    const today = new Date();
    return await this.repository
      .createQueryBuilder("tournament")
      .where("tournament.endDate < :today", { today })
      .getMany();
  }

  async getTournament(id: number): Promise<Tournament> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async getTournamentEnrollments(id: number) {
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

  async getCurrentDraft(tournamentId: number): Promise<Draft> {
    return await this.appDataSource
      .getRepository(Draft)
      .createQueryBuilder("draft")
      .leftJoin("draft.tournament", "tournament")
      .where("draft.status = 'started'")
      .andWhere("tournament.id = :tournamentId", { tournamentId })
      .orderBy('"draftNumber"', "DESC")
      .getOne();
  }

  async startTournament(tournamentId: number) {
    await this.repository
      .createQueryBuilder("tournament")
      .update()
      .set({ status: "started" })
      .where({ id: tournamentId })
      .execute();

    return await this.getTournamentAndDrafts(tournamentId);
  }

  async generateDraftSeatings(pods: DraftPod[], players: User[]) {
    pods.forEach((pod, podIndex) => {
      const podPlayers = players.slice(podIndex * 8, (podIndex + 1) * 8);
      podPlayers.forEach(async (player, playerIndex) => {
        await this.appDataSource.getRepository(DraftPodSeat).insert({
          pod,
          seat: playerIndex + 1,
          player,
        });
      });
    });
  }

  async generateDrafts(tournamentId: number) {
    // TODO this just randomizes players and cubes + assigns them afterwards
    // better algorithms suggested and required for production use

    const tournament = await this.getTournamentAndDrafts(tournamentId);
    const players = (
      await this.getTournamentEnrollments(tournamentId)
    ).enrollments
      .map((enr) => enr.player)
      .sort((_a, __b) => 0.5 - Math.random());
    const cubes = (
      await this.cubeService.getCubesForTournament(tournamentId)
    ).sort((_a, __b) => 0.5 - Math.random());
    const podsPerDraft = tournament.totalSeats / 8;

    if (players.length !== tournament.totalSeats) {
      console.log("not all seats will be filled");
    }
    if (cubes.length < podsPerDraft) {
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
              cube: cubes[index],
            })
          );
        }
        await this.generateDraftSeatings(draftPods, players);
      })
    );
    return await this.getTournamentAndDrafts(tournamentId);
  }

  async startDraft(tournamentId: number, draftId: number) {
    await this.appDataSource
      .getRepository(Draft)
      .createQueryBuilder("draft")
      .update()
      .set({ status: "started" })
      .where({ id: draftId })
      .execute();

    return await this.getTournamentAndDrafts(tournamentId);
  }

  async startRound(tournamentId: number, roundId: number) {
    await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .update()
      .set({ startTime: new Date(), status: "started" })
      .where({ id: roundId })
      .execute();

    return await this.getCurrentRound(tournamentId);
  }

  async resetRecentMatchesForTournament(tournamentId: number) {
    const round = await this.getCurrentRound(tournamentId);
    if (round) {
      const matches = await this.matchService.getMatchesForRound(round.id);
      matches.forEach((match) => {
        this.matchService.submitResult(match.id, null, 0, 0);
      });
      return true;
    } else {
      return;
    }
  }
}
