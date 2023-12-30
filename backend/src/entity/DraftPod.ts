import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Cube } from "./Cube";
import { Draft } from "./Draft";
import { DraftPodSeat } from "./DraftPodSeat";

@Entity()
@Unique(["draft", "podNumber"])
export class DraftPod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Draft, (draft) => draft.pods)
  draft: Draft;

  @Column("smallint")
  podNumber: number;

  @OneToOne(() => Cube)
  @JoinColumn()
  cube: Cube;

  @OneToMany(() => DraftPodSeat, (seat) => seat.pod)
  seats: DraftPodSeat[];
}
