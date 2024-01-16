import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { Tournament } from "./Tournament";

@Entity()
export class Cube {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  owner: string;

  @Column()
  url: string;

  @ManyToMany(() => Tournament, (tournament) => tournament.cubes)
  tournaments: Tournament[];
}
