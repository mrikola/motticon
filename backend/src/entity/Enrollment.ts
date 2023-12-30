import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { User } from "./User";
import { Tournament } from "./Tournament";

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.enrollments)
  tournament: Tournament;

  @ManyToOne(() => User, (user) => user.enrollments)
  player: User;

  @Column()
  paid: boolean;

  @Column()
  dropped: boolean;
}
