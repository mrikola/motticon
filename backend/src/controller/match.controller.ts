import { MatchService } from "../service/match.service";

const matchService = new MatchService();

export const getPlayerMatchHistory = async (req) => {
  const { userId, tournamentId } = req.params;
  return await matchService.getPlayerMatchHistory(userId, tournamentId);
};
