import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CardList } from "./CardList";
import { Card, Token } from "./Card";
import { PickedCard } from "./PickedCard";

@Entity()
export class ListedCard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Card, { onDelete: "CASCADE" })
  card: Card;

  @ManyToOne(() => CardList)
  cardlist: CardList;

  @OneToMany(() => PickedCard, (pickedCard) => pickedCard.listedCard, {
    onDelete: "CASCADE",
  })
  pickedCards: PickedCard[];

  @Column("smallint")
  quantityInCube: number;
}
