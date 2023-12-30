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

  @OneToOne(() => User)
  @JoinColumn()
  player1: User;

  @OneToOne(() => User)
  @JoinColumn()
  player2: User;

  @Column("smallint")
  player1GamesWon: number;

  @Column("smallint")
  player2GamesWon: number;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  resultSubmittedBy: User;
}
