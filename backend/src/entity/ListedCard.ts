import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CardList } from "./CardList";
import { Card } from "./Card";

@Entity()
export class ListedCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  card: Card;

  @ManyToOne(() => CardList)
  cardlist: CardList;

  @Column("smallint")
  quantityInCube: number;

  @Column("smallint")
  quantityInUse: number;
}
