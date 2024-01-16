import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";
import { Match } from "./Match";
import { Tournament } from "./Tournament";
import { RoundStatus } from "../dto/general.dto";

@Entity()
export class Round {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  tournamentId: number;

  @ManyToOne(() => Tournament)
  tournament: Tournament;

  @Column("smallint")
  roundNumber: number;

  @Column({ default: "pending" })
  status: RoundStatus;

  @Column("timestamp", { nullable: true })
  startTime: Timestamp;

  @OneToMany(() => Match, (match) => match.round)
  matches: Match[];
}
