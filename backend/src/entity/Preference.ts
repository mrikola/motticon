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

  @OneToOne(() => Tournament)
  @JoinColumn()
  tournament: Tournament;

  @OneToOne(() => User)
  @JoinColumn()
  player: User;

  @OneToOne(() => Cube)
  @JoinColumn()
  cube: Cube;

  @Column("smallint")
  points: number;
}
