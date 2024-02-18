import { Match } from "../entity/Match";
import { Round } from "../entity/Round";
import { PodDraftMatch } from "./draft.dto";
import { RoundStatus } from "./general.dto";
import { TournamentDto, tournamentToDto } from "./tournaments.dto";
import { PlayerDto, playerToDto } from "./user.dto";

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

export const matchToDto = (match: Match): MatchDto =>
  match
    ? {
        id: match.id,
        round: roundToDto(match.round),
        tableNumber: match.tableNumber,
        player1: playerToDto(match.player1),
        player2: playerToDto(match.player2),
        player1GamesWon: match.player1GamesWon,
        player2GamesWon: match.player2GamesWon,
        resultSubmittedBy: playerToDto(match.resultSubmittedBy),
        playerGoingFirst: playerToDto(match.playerGoingFirst),
        matchType: match.matchType,
      }
    : undefined;

export const roundToDto = (round: Round): RoundDto =>
  round
    ? {
        id: round.id,
        tournament: tournamentToDto(round.tournament),
        roundNumber: round.roundNumber,
        status: round.status,
        startTime: round.startTime,
        matches: round.matches?.map(matchToDto),
      }
    : undefined;
