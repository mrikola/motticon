import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  Column,
  JoinColumn,
} from "typeorm";
import { Cube } from "./Cube";
import { Card } from "./Card";

@Entity()
@Unique(["cube"])
export class CardList {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  cubeId: number;

  @ManyToOne(() => Cube)
  cube: Cube;

  @ManyToOne(() => Card, (card) => card.cardlists)
  card: Card;

  @Column("smallint")
  quantityInCube: number;

  @Column("smallint")
  quantityInUse: number;
}
