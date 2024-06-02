import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DraftPodSeat } from "./DraftPodSeat";
import { ListedCard } from "./ListedCard";

@Entity()
export class PickedCard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ListedCard, { onDelete: "CASCADE" })
  listedCard: ListedCard;

  @Column("smallint")
  quantityPicked: number;

  @ManyToOne(() => DraftPodSeat)
  picker: DraftPodSeat;
}
