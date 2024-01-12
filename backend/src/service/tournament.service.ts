import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Tournament } from "../entity/Tournament";
import { partition, uniqBy } from "lodash";
import { TournamentsByType } from "../dto/tournaments.dto";
import { Round } from "../entity/Round";
import { Draft } from "../entity/Draft";

export class TournamentService {
  private appDataSource: DataSource;
  private repository: Repository<Tournament>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Tournament);
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
      .where("tournament.id = :id", { id })
      .orderBy('"roundNumber"', "DESC")
      .getOne();
  }

  async getCurrentDraft(id: number): Promise<Draft> {
    const currentRound = await this.getCurrentRound(id);
    const drafts = await this.appDataSource
      .getRepository(Draft)
      .createQueryBuilder("draft")
      .leftJoin("draft.tournament", "tournament")
      .where("tournament.id = :id", { id })
      .orderBy('"draftNumber"', "ASC")
      .getMany();

    let roundsAllocated = 0;
    let currentDraft;
    drafts.forEach((draft) => {
      if (
        roundsAllocated < currentRound.roundNumber &&
        roundsAllocated + draft.rounds >= currentRound.roundNumber
      ) {
        currentDraft = draft;
      }
      roundsAllocated += draft.rounds;
    });

    return currentDraft;
  }
}
