import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

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
}
