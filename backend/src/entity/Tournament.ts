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
import { TournamentStatus } from "../dto/general.dto";
import { Draft } from "./Draft";

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

  @Column({ default: 0 })
  entryFee: number;

  @Column("smallint", { default: 8 })
  totalSeats: number;

  @Column("smallint", { default: 0 })
  preferencesRequired: number;

  @Column({ default: "pending" })
  status: TournamentStatus;

  @OneToMany(() => Draft, (draft) => draft.tournament)
  drafts: Draft[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.tournament)
  enrollments: Enrollment[];

  @ManyToMany(() => Cube, (cube) => cube.tournaments)
  @JoinTable({ name: "tournament_cubes" })
  cubes: Cube[];

  @ManyToMany(() => User, (user) => user.tournamentsStaffed)
  @JoinTable({ name: "tournament_staff_members" })
  staffMembers: User[];
}
