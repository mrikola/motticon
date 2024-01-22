import { DataSource } from "typeorm";
import { AppDataSource } from "../data-source";
import { DraftPod } from "../entity/DraftPod";
import { DraftPodSeat } from "../entity/DraftPodSeat";
import { Round } from "../entity/Round";

export class DraftService {
  private appDataSource: DataSource;

  constructor() {
    this.appDataSource = AppDataSource;
  }

  async getPodsForDraft(draftId: number): Promise<DraftPod[]> {
    return await this.appDataSource
      .getRepository(DraftPod)
      .createQueryBuilder("pod")
      .leftJoinAndSelect("pod.cube", "cube")
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

  async getRoundsForDraft(draftId: number): Promise<Round[]> {
    return await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .leftJoinAndSelect("round.matches", "match")
      .leftJoin("round.tournament", "tournament")
      .leftJoin("tournament.drafts", "draft")
      .where("draft.id = :draftId", { draftId })
      .andWhere(
        'round."roundNumber" between draft."firstRound" and draft."lastRound"'
      )
      .getMany();
  }
}
