import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Tournament } from "./Tournament";
import { Cube } from "./Cube";

@Entity()
export class Preference {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  tournamentId: number;

  @ManyToOne(() => Tournament)
  tournament: Tournament;

  @JoinColumn()
  playerId: number;

  @ManyToOne(() => User)
  player: User;

  @ManyToOne(() => Cube)
  @JoinColumn()
  cube: Cube;

  @Column("smallint")
  points: number;
}
