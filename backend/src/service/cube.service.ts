import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Cube } from "../entity/Cube";

export class CubeService {
  private appDataSource: DataSource;
  private repository: Repository<Cube>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Cube);
  }

  async getAllCubes(): Promise<Cube[]> {
    return await this.repository.find();
  }

  async getCube(id: number): Promise<Cube> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async getCubesForTournament(tournamentId: number): Promise<Cube[]> {
    return await this.repository
      .createQueryBuilder("cube")
      .leftJoinAndSelect("cube.tournaments", "tournament")
      .where("tournament.id = :tournamentId", { tournamentId })
      .getMany();
  }
}
