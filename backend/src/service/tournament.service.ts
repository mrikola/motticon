import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Tournament } from "../entity/Tournament";
import { partition } from "lodash";
import { TournamentsByType } from "../dto/tournaments.dto";
import { Round } from "../entity/Round";
import { Draft } from "../entity/Draft";
import { DraftWithRoundNumber } from "../dto/draft.dto";
import { MatchService } from "./match.service";
import { Cube } from "../entity/Cube";

export class TournamentService {
  private appDataSource: DataSource;
  private repository: Repository<Tournament>;
  private matchService: MatchService;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Tournament);
    this.matchService = new MatchService();
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

    for (let index = 0; index < drafts; ++index) {
      await this.appDataSource
        .createQueryBuilder()
        .insert()
        .into(Draft)
        .values({
          draftNumber: index + 1,
          tournament,
          rounds: 3,
        })
        .execute();
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

  async getCurrentRound(id: number): Promise<Round> {
    return await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .leftJoin("round.tournament", "tournament")
      .where("round.status = 'started'")
      .andWhere("tournament.id = :id", { id })
      .orderBy('"roundNumber"', "DESC")
      .getOne();
  }

  async getCurrentDraft(id: number): Promise<DraftWithRoundNumber> {
    const currentRound = await this.getCurrentRound(id);
    return this.getDraftByRoundNumber(id, currentRound?.roundNumber);
  }

  async getDraftByRoundNumber(
    id: number,
    roundNumber: number
  ): Promise<DraftWithRoundNumber> {
    const drafts = await this.appDataSource
      .getRepository(Draft)
      .createQueryBuilder("draft")
      .leftJoin("draft.tournament", "tournament")
      .where("tournament.id = :id", { id })
      .orderBy('"draftNumber"', "ASC")
      .getMany();

    let roundsAllocated = 0;
    let roundInDraft = 0;
    let currentDraft;
    drafts.forEach((draft) => {
      if (
        roundsAllocated < roundNumber &&
        roundsAllocated + draft.rounds >= roundNumber
      ) {
        currentDraft = draft;
        roundInDraft = roundNumber - roundsAllocated;
      }
      roundsAllocated += draft.rounds;
    });

    return { ...currentDraft, roundInDraft };
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
