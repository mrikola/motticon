import { MatchService } from "../service/match.service";

const matchService = new MatchService();

export const getPlayerMatchHistory = async (req) => {
  const { userId, tournamentId } = req.params;
  return await matchService.getPlayerMatchHistory(userId, tournamentId);
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
