import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { DraftPod } from "./DraftPod";
import { Tournament } from "./Tournament";

@Entity()
@Unique(["tournament", "draftNumber"])
export class Draft {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Tournament)
  @JoinColumn()
  tournament: Tournament;

  @Column("smallint")
  draftNumber: number;

  @Column("smallint")
  rounds: number;

  @OneToMany(() => DraftPod, (pod) => pod.draft)
  pods: DraftPod[];
}
