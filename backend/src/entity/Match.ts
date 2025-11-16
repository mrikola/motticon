import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Round } from "./Round";
import { User } from "./User";
import { DraftPod } from "./DraftPod";
import { PodDraftMatch } from "../dto/draft.dto";

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Round, (round) => round.matches)
  round: Round;

  @Column("smallint")
  tableNumber: number;

  @JoinColumn()
  player1Id: number;

  @ManyToOne(() => User)
  player1: User;

  @JoinColumn()
  player2Id: number;

  @ManyToOne(() => User)
  player2: User;

  @Column("smallint", { default: 0 })
  player1GamesWon: number;

  @Column("smallint", { default: 0 })
  player2GamesWon: number;

  @JoinColumn()
  resultSubmittedById: number;

  @ManyToOne(() => User, { nullable: true })
  resultSubmittedBy: User;

  @JoinColumn()
  playerGoingFirstId: number;

  @ManyToOne(() => User, { nullable: true })
  playerGoingFirst: User;

  @Column("varchar")
  matchType: PodDraftMatch;

  @JoinColumn()
  podId: number | null;

  @ManyToOne(() => DraftPod, { nullable: true })
  pod: DraftPod | null;

  @BeforeInsert()
  determineStartingPlayer() {
    this.playerGoingFirst = Math.random() < 0.5 ? this.player1 : this.player2;
  }
}
