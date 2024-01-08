import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
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

  @OneToOne(() => Tournament)
  tournament: Tournament;

  @JoinColumn()
  playerId: number;

  @OneToOne(() => User)
  player: User;

  @OneToOne(() => Cube)
  @JoinColumn()
  cube: Cube;

  @Column("smallint")
  points: number;
}
