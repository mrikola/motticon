import { UserService } from "../service/user.service";

const userService = new UserService();

export const getUsersTournaments = async (req) => {
  const { id } = req.params;
  return await userService.getUsersTournaments(id as number);
};

export const getUserTournamentInfo = async (req) => {
  const { userId, tournamentId } = req.params;
  return await userService.getUserTournamentInfo(
    userId,
    tournamentId as number
  );
};
