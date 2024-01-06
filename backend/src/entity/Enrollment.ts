import {
  Column,
  Entity,
  JoinColumn,
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

  @JoinColumn()
  tournamentId: Tournament;

  @ManyToOne(() => Tournament, (tournament) => tournament.enrollments)
  tournament: Tournament;

  @JoinColumn()
  playerId: User;

  @ManyToOne(() => User, (user) => user.enrollments)
  player: User;

  @Column()
  paid: boolean;

  @Column()
  dropped: boolean;
}
