import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Tournament } from "./Tournament";
import { CardList } from "./CardList";
import { TournamentCube } from "./TournamentCube";

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

  @Column({ type: "integer", default: 360 })
  cardCount: number;

  @ManyToOne(() => CardList, { nullable: true })
  cardlist: CardList;

  @OneToMany(() => TournamentCube, (tc) => tc.cube)
  tournamentAllocations: TournamentCube[];
}
