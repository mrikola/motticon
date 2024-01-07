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
import { Cube } from "./Cube";

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.tournament)
  enrollments: Enrollment[];

  @ManyToMany(() => Cube)
  @JoinTable({ name: "tournament_cubes" })
  cubes: Cube[];

  @ManyToMany(() => User, (user) => user.tournamentsStaffed)
  @JoinTable({ name: "tournament_staff_members" })
  staffMembers: User[];
}
