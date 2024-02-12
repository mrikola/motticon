import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DraftPod } from "./DraftPod";
import { User } from "./User";

@Entity()
export class DraftPodSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  podId: number;

  @ManyToOne(() => DraftPod, (pod) => pod.seats)
  pod: DraftPod;

  @JoinColumn()
  playerId: number;

  @ManyToOne(() => User)
  player: User;

  @Column("smallint")
  seat: number;

  @Column({ nullable: true })
  deckPhotoUrl: string;

  @Column()
  draftPoolReturned: boolean;
}
