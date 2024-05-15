import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  Column,
  OneToMany,
} from "typeorm";
import { Cube } from "./Cube";
import { ListedCard } from "./ListedCard";

@Entity()
@Unique(["cube"])
export class CardList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cubeId: number;

  @ManyToOne(() => Cube)
  cube: Cube;

  @OneToMany(() => ListedCard, (listedcard) => listedcard.cardlist)
  cards: ListedCard[];
}
