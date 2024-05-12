import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { Tournament } from "./Tournament";
import { CardList } from "./CardList";

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

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => CardList, { nullable: true })
  cardlist: CardList;

  @ManyToMany(() => Tournament, (tournament) => tournament.cubes)
  tournaments: Tournament[];
}
