import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Tournament } from "./Tournament";

@Entity()
export class PlayerTournamentScore {
  @PrimaryColumn({ name: "player_id" })
  playerId: number;

  @PrimaryColumn({ name: "tournament_id" })
  tournamentId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "player_id" })
  player: User;

  @ManyToOne(() => Tournament)
  @JoinColumn({ name: "tournament_id" })
  tournament: Tournament;

  @Column({ type: "integer", default: 0 })
  points: number;

  @Column({ type: "integer", default: 0 })
  draftsWon: number;

  @Column({ type: "decimal", default: 0 })
  opponentMatchWinPercentage: number;
}
