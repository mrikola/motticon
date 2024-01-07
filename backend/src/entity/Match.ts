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

  @OneToOne(() => User)
  player1: User;

  @JoinColumn()
  player2Id: number;

  @OneToOne(() => User)
  player2: User;

  @Column("smallint")
  player1GamesWon: number;

  @Column("smallint")
  player2GamesWon: number;

  @JoinColumn()
  resultSubmittedById: number;

  @OneToOne(() => User, { nullable: true })
  resultSubmittedBy: User;
}
