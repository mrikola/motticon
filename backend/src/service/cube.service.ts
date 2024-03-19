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
  ): Promise<Cube> {
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
      return null;
    }
  }

  async editCube(
    cubeId: number,
    title: string,
    description: string,
    url: string,
    owner: string,
    imageUrl: string
  ): Promise<Cube> {
    console.log("received:");
    console.log("title: " + title);
    console.log("description: " + description);
    console.log("url: " + url);
    console.log("owner: " + owner);
    await this.repository
      .createQueryBuilder("cube")
      .update(Cube)
      .set({
        title,
        description,
        url,
        owner,
        imageUrl,
      })
      .where("id = :cubeId", { cubeId })
      .execute();
    return await this.getCube(cubeId);
  }
}
