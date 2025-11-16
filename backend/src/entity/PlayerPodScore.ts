import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "./User";
import { DraftPod } from "./DraftPod";

@Entity()
export class PlayerPodScore {
  @PrimaryColumn({ name: "player_id" })
  playerId: number;

  @PrimaryColumn({ name: "pod_id" })
  podId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "player_id" })
  player: User;

  @ManyToOne(() => DraftPod)
  @JoinColumn({ name: "pod_id" })
  pod: DraftPod;

  @Column({ type: "integer", default: 0 })
  matchPoints: number;

  @Column({ type: "decimal", default: 0 })
  opponentMatchWinPercentage: number;

  @Column({ type: "integer", default: 0 })
  gamesWon: number;

  @Column({ type: "integer", default: 0 })
  gamesPlayed: number;
}

