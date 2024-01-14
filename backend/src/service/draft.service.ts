import { DataSource } from "typeorm";
import { AppDataSource } from "../data-source";
import { DraftPod } from "../entity/DraftPod";
import { DraftPodSeat } from "../entity/DraftPodSeat";

export class DraftService {
  private appDataSource: DataSource;

  constructor() {
    this.appDataSource = AppDataSource;
  }

  async getPodsForDraft(draftId: number): Promise<DraftPod[]> {
    return await this.appDataSource
      .getRepository(DraftPod)
      .createQueryBuilder("pod")
      .where('pod."draftId" = :draftId', { draftId })
      .getMany();
  }

  async getSeatsForPod(draftPodId: number): Promise<DraftPodSeat[]> {
    return await this.appDataSource
      .getRepository(DraftPodSeat)
      .createQueryBuilder("seat")
      .leftJoinAndSelect("seat.player", "player")
      .where('seat."podId" = :draftPodId', { draftPodId })
      .getMany();
  }
}
