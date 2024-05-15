import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CardList } from "./CardList";
import { Card } from "./Card";
import { PickedCard } from "./PickedCard";

@Entity()
export class ListedCard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Card)
  card: Card;

  @ManyToOne(() => CardList)
  cardlist: CardList;

  @OneToMany(() => PickedCard, (pickedCard) => pickedCard.listedCard)
  pickedCards: PickedCard[];

  @Column("smallint")
  quantityInCube: number;
}
