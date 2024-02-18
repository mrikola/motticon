import { PodDraftMatch } from "./draft.dto";
import { RoundStatus } from "./general.dto";
import { TournamentDto } from "./tournaments.dto";
import { PlayerDto } from "./user.dto";

export type MatchDto = {
  id: number;
  round: RoundDto;
  tableNumber: number;
  player1: PlayerDto;
  player2: PlayerDto;
  player1GamesWon: number;
  player2GamesWon: number;
  resultSubmittedBy: PlayerDto;
  playerGoingFirst: PlayerDto;
  matchType: PodDraftMatch;
};

export type RoundDto = {
  id: number;
  tournament: TournamentDto;
  roundNumber: number;
  status: RoundStatus;
  startTime: Date;
  matches: MatchDto[];
};
