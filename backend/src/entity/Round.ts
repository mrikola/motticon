import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";
import { Match } from "./Match";
import { Tournament } from "./Tournament";

@Entity()
export class Round {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament)
  @JoinColumn()
  tournament: Tournament;

  @Column("smallint")
  roundNumber: number;

  @Column("timestamp", { nullable: true })
  startTime: Timestamp;

  @OneToMany(() => Match, (match) => match.round)
  matches: Match[];
}
