import { UserService } from "../service/user.service";

const userService = new UserService();

export const getUsersTournaments = async (req) => {
  const { id } = req.params;
  return await userService.getUsersTournaments(id as number);
};

export const getTournamentsStaffed = async (req) => {
  const { userId } = req.params;
  return await userService.getTournamentsStaffed(userId as number);
};

export const getUserTournamentInfo = async (req) => {
  const { userId, tournamentId } = req.params;
  return await userService.getUserTournamentInfo(
    userId,
    tournamentId as number
  );
};

export const getCurrentDraftAndMatch = async (req) => {
  const { userId, tournamentId } = req.params;
  return await userService.getCurrentDraftAndMatch(
    userId,
    tournamentId as number
  );
};
