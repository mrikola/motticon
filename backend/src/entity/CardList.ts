import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  Column,
  JoinColumn,
  ManyToMany,
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

  @ManyToMany(() => ListedCard, (listedcard) => listedcard.cardlists)
  card: ListedCard[];
}
