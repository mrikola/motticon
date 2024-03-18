import { DataSource, Repository } from "typeorm";
import { Preference } from "../entity/Preference";
import { AppDataSource } from "../data-source";

export class PreferenceService {
  private appDataSource: DataSource;
  private repository: Repository<Preference>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Preference);
  }

  async setPreference(
    tournamentId: number,
    userId: number,
    cubeId: number,
    points: number
  ): Promise<boolean> {
    try {
      await this.appDataSource
        .createQueryBuilder()
        .insert()
        .into(Preference)
        .values({
          player: { id: userId },
          tournament: { id: tournamentId },
          cube: { id: cubeId },
          points,
        })
        .execute();
      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  async getPreferencesForTournament(
    tournamentId: number
  ): Promise<Preference[]> {
    return await this.repository
      .createQueryBuilder("preference")
      .leftJoinAndSelect("preference.player", "player")
      .leftJoinAndSelect("preference.cube", "cube")
      .where('preference."tournamentId" = :tournamentId', { tournamentId })
      .getMany();
  }
}
