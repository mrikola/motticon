import { MatchService } from "../service/match.service";

const matchService = new MatchService();

export const getPlayerMatchHistory = async (req) => {
  const { userId, tournamentId } = req.params;
  return await matchService.getPlayerMatchHistory(userId, tournamentId);
};

export const getMatchesForRound = async (req) => {
  const { roundId } = req.params;
  return await matchService.getMatchesForRound(roundId);
};

export const submitResult = async (req) => {
  const { matchId, resultSubmittedBy, player1GamesWon, player2GamesWon } =
    req.body;
  return await matchService.submitResult(
    matchId,
    resultSubmittedBy,
    player1GamesWon,
    player2GamesWon
  );
};

export const staffSubmitResult = async (req) => {
  const {
    roundId,
    matchId,
    resultSubmittedBy,
    player1GamesWon,
    player2GamesWon,
  } = req.body;
  return await matchService.staffSubmitResult(
    roundId,
    matchId,
    resultSubmittedBy,
    player1GamesWon,
    player2GamesWon
  );
};
