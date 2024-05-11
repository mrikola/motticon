import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { CardList } from "./CardList";

@Entity()
@Unique(["scryfallId"])
export class Card {
  @PrimaryGeneratedColumn()
  scryfallId: string;

  @Column()
  name: string;

  @Column()
  set: string;

  @OneToMany(() => CardList, (cardlist) => cardlist.card)
  cardlists: CardList[];
}
