import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Tournament } from "../entity/Tournament";
import { partition, uniqBy } from "lodash";
import { TournamentsByType } from "../dto/tournaments.dto";
import { Cube } from "../entity/Cube";

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
}
