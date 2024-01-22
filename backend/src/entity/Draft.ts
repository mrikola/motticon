import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { DraftPod } from "./DraftPod";
import { Tournament } from "./Tournament";
import { DraftStatus } from "../dto/general.dto";

@Entity()
@Unique(["tournament", "draftNumber"])
export class Draft {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament)
  @JoinColumn()
  tournament: Tournament;

  @Column("smallint")
  draftNumber: number;

  @Column("smallint", { default: 1 })
  firstRound: number;

  @Column("smallint", { default: 3 })
  lastRound: number;

  @Column({ default: "pending" })
  status: DraftStatus;

  @OneToMany(() => DraftPod, (pod) => pod.draft)
  pods: DraftPod[];
}
