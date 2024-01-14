import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Round } from "./Round";
import { User } from "./User";
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

  @Column("varchar")
  matchType: PodDraftMatch;
}
