import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { Enrollment } from "./Enrollment";
import { Tournament } from "./Tournament";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  isAdmin: boolean;

  @Column({ default: false })
  isDummy: boolean;

  @Column({ type: "decimal", default: 1600 })
  rating: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.player)
  enrollments: Enrollment[];

  @ManyToMany(() => Tournament, (tournament) => tournament.staffMembers)
  tournamentsStaffed: Tournament[];
}
