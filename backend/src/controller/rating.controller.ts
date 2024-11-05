import { Container } from '../container';
import { RatingService } from "../service/rating.service";

const ratingService: RatingService = Container.get('RatingService');

export const updateElo = async (req) => {
  const { kValue, player1Id, player2Id, winnerNumber } = req.body;
  return await ratingService.updateElo(kValue, player1Id, player2Id, winnerNumber);
};

export const resetEloForUser = async (req) => {
  const { playerId } = req.params;
  return await ratingService.resetEloForUser(playerId);
};
