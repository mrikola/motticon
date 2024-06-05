import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Color } from "../dto/card.dto";

export type CardFace = {
  name: string;
  manaCost: string;
  oracleText: string;
  colors: Color[];
  power: number;
  toughness: number;
  imageUri: string;
};

@Entity()
@Unique(["scryfallId"])
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scryfallId: string;

  @Column()
  name: string;

  @Column({ nullable: true, default: "" })
  manaCost: string;

  @Column({ nullable: true, default: "" })
  oracleText: string;

  @Column({ nullable: true })
  power: number;

  @Column({ nullable: true })
  toughness: number;

  @Column({ nullable: true, default: "" })
  set: string;

  @Column({ nullable: true })
  cmc: number;

  @Column("simple-array", { nullable: true })
  colors: Color[];

  @Column({ nullable: true, default: "" })
  type: string;

  @Column("simple-array", { nullable: true })
  faces: CardFace[];

  @ManyToMany(() => Token, (token) => token.tokenFor)
  @JoinTable({ name: "card_tokens" })
  tokens: Token[];
}

@Entity("card")
export class Token extends Card {
  @ManyToMany(() => Card, (card) => card.tokens)
  tokenFor: Card[];
}
