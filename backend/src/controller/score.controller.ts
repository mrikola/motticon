import { ScoreService } from "../service/score.service";

const scoreService = new ScoreService();

export const getPreviousScore = async (req) => {
  const { tournamentId, userId } = req.params;
  return await scoreService.getPreviousScore(tournamentId, userId);
};

export const getStandings = async (req) => {
  const { tournamentId, roundNumber } = req.params;
  return await scoreService.getStandings(tournamentId, roundNumber);
};
