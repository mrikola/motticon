import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Enrollment } from "./Enrollment";
import { User } from "./User";

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.tournament)
  enrollments: Enrollment[];

  @ManyToMany(() => User)
  @JoinTable({ name: "tournament_staff_members" })
  staffMembers: User[];
}
