import { ScoreService } from "../service/score.service";

const scoreService = new ScoreService();

export const getStandings = async (req) => {
  const { tournamentId, roundNumber } = req.params;
  return await scoreService.getStandings(tournamentId, roundNumber);
};
