import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Tournament } from "./Tournament";
import { Cube } from "./Cube";

@Entity("tournament_cubes")
export class TournamentCube {
  @ManyToOne(() => Tournament, (tournament) => tournament.cubeAllocations)
  @PrimaryColumn({ name: "tournamentId", type: "integer" })
  @JoinColumn({ referencedColumnName: "id" })
  @Index()
  tournament: Tournament;

  @ManyToOne(() => Cube, (cube) => cube.tournamentAllocations)
  @PrimaryColumn({ name: "cubeId", type: "integer" })
  @JoinColumn({ referencedColumnName: "id" })
  @Index()
  cube: Cube;

  @Column({ default: 1 })
  count: number;
}
