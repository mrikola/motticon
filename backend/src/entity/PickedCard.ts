import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CardList } from "./CardList";
import { Card } from "./Card";
import { DraftPodSeat } from "./DraftPodSeat";

@Entity()
export class PickedCard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Card)
  card: Card;

  @ManyToOne(() => CardList)
  cardlist: CardList;

  @Column("smallint")
  quantityPicked: number;

  @OneToOne(() => DraftPodSeat)
  picker: DraftPodSeat;
}
