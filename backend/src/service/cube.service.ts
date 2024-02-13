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
      .leftJoin("cube.tournaments", "tournament")
      .where("tournament.id = :tournamentId", { tournamentId })
      .getMany();
  }

  async addCube(
    title: string,
    description: string,
    url: string,
    owner: string,
    imageUrl: string
  ): Promise<any> {
    // TODO improve return values
    try {
      const cube: Cube = await this.repository.save({
        title,
        description,
        url,
        owner,
        imageUrl,
      });
      return cube;
    } catch {
      return false;
    }
  }
}
