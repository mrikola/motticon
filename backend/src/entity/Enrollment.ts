import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Tournament } from "./Tournament";

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  tournamentId: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.enrollments)
  tournament: Tournament;

  @JoinColumn()
  playerId: number;

  @ManyToOne(() => User, (user) => user.enrollments)
  player: User;

  @Column()
  paid: boolean;

  @Column()
  dropped: boolean;
}
