import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { DraftPod } from "./DraftPod";
import { Round } from "./Round";

@Entity()
export class PlayerPodScoreHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "player_id" })
  playerId: number;

  @Column({ name: "pod_id" })
  podId: number;

  @Column({ name: "round_id" })
  roundId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "player_id" })
  player: User;

  @ManyToOne(() => DraftPod)
  @JoinColumn({ name: "pod_id" })
  pod: DraftPod;

  @ManyToOne(() => Round)
  @JoinColumn({ name: "round_id" })
  round: Round;

  @Column({ type: "integer", default: 0 })
  matchPoints: number;

  @Column({ type: "decimal", default: 0 })
  opponentMatchWinPercentage: number;

  @Column({ type: "integer", default: 0 })
  gamesWon: number;

  @Column({ type: "integer", default: 0 })
  gamesPlayed: number;
}

