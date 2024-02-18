import { MatchDto, matchToDto } from "../dto/round.dto";
import { MatchService } from "../service/match.service";

const matchService = new MatchService();

export const getPlayerMatchHistory = async (req): Promise<MatchDto[]> => {
  const { userId, tournamentId } = req.params;
  return (await matchService.getPlayerMatchHistory(userId, tournamentId)).map(
    matchToDto
  );
};

export const getMatchesForRound = async (req): Promise<MatchDto[]> => {
  const { roundId } = req.params;
  return (await matchService.getMatchesForRound(roundId)).map(matchToDto);
};

export const submitResult = async (req): Promise<MatchDto> => {
  const {
    matchId,
    roundId,
    resultSubmittedBy,
    player1GamesWon,
    player2GamesWon,
  } = req.body;
  return matchToDto(
    await matchService.submitResult(
      matchId,
      roundId,
      resultSubmittedBy,
      player1GamesWon,
      player2GamesWon
    )
  );
};

export const staffSubmitResult = async (req): Promise<MatchDto[]> => {
  const {
    roundId,
    matchId,
    resultSubmittedBy,
    player1GamesWon,
    player2GamesWon,
  } = req.body;
  return (
    await matchService.staffSubmitResult(
      roundId,
      matchId,
      resultSubmittedBy,
      player1GamesWon,
      player2GamesWon
    )
  ).map(matchToDto);
};
