import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Color } from "../dto/card.dto";

@Entity()
@Unique(["scryfallId"])
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scryfallId: string;

  @Column()
  name: string;

  @Column()
  set: string;

  @Column({ nullable: true })
  cmc: number;

  @Column("simple-array", { nullable: true })
  colors: Color[];

  @Column()
  type: string;
}
