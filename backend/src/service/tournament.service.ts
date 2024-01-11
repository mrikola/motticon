import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Tournament } from "../entity/Tournament";
import { partition, uniqBy } from "lodash";
import { TournamentsByType } from "../dto/tournaments.dto";
import { Round } from "../entity/Round";
import { Draft } from "../entity/Draft";
import { Enrollment } from "../entity/Enrollment";

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

  async enrollIntoTournament(
    tournamentId: number,
    userId: number
  ): Promise<any> {
    this.appDataSource
      .createQueryBuilder()
      .insert()
      .into(Enrollment)
      .values({
        player: { id: userId },
        tournament: { id: tournamentId },
        paid: false,
        dropped: false,
      })
      .execute();
  }

  async dropFromTournament(tournamentId: number, userId: number): Promise<any> {
    // todo: make sure this actually works and doesn't break stuff horribly
    this.appDataSource
      .createQueryBuilder()
      .delete()
      .from(Enrollment)
      .where("tournamentId = :tournamentId", { tournamentId })
      .andWhere("playerId = :userId", { userId })
      .execute();
  }

  async getTournament(id: number): Promise<Tournament> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async getTournamentCubes(id: number): Promise<Tournament[]> {
    // const cubes = await this.appDataSource
    //   .getRepository(Cube)
    //   .createQueryBuilder("cube")
    //   .leftJoinAndSelect("tournament_cubes", "cube")
    //   .where("cube.tournamentId = :id", { id })
    //   .getMany();
    // return cubes;
    const enrollments = await this.appDataSource
      .getRepository(Tournament)
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.enrollments", "enrollment")
      .leftJoinAndSelect("enrollment.player", "user")
      .where("user.id = :id", { id })
      .getMany();
    return enrollments;
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
