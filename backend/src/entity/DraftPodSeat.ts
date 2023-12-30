import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { DraftPod } from "./DraftPod";
import { User } from "./User";

@Entity()
export class DraftPodSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DraftPod, (pod) => pod.seats)
  @JoinColumn()
  pod: DraftPod;

  @OneToOne(() => User)
  @JoinColumn()
  player: User;

  @Column("smallint")
  seat: number;

  @Column({ nullable: true })
  deckPhotoUrl: string;
}
