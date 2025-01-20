import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  Column,
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

  @JoinColumn()
  draftId: number;

  @ManyToOne(() => Draft, (draft) => draft.pods)
  draft: Draft;

  @Column("smallint")
  podNumber: number;

  @JoinColumn()
  cubeId: number;

  @ManyToOne(() => Cube)
  cube: Cube;

  @OneToMany(() => DraftPodSeat, (seat) => seat.pod)
  seats: DraftPodSeat[];
}
