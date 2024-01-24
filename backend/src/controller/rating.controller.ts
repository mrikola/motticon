import { RatingService } from "../service/rating.service";

const userService = new RatingService();

export const updateElo = async (req) => {
  const { kValue, player1Id, player2Id, winnerNumber } = req.body;
  return await userService.updateElo(
    kValue,
    player1Id,
    player2Id,
    winnerNumber
  );
};

export const resetEloForUser = async (req) => {
  const { playerId } = req.params;
  return await userService.resetEloForUser(playerId);
};
