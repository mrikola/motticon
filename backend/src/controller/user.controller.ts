import { encodePassword } from "../auth/auth";
import { EnrollmentService } from "../service/enrollment.service";
import { UserService } from "../service/user.service";

const userService = new UserService();
const enrollmentService = new EnrollmentService();

export const signup = async (req) => {
  const { firstName, lastName, email, password } = req.body;
  return await userService.createUser(firstName, lastName, email, password);
};

export const getUser = async (req) => {
  const { id } = req.params;
  return await userService.getUser(id as number);
};

export const getAllUsers = async () => {
  return await userService.getAllUsers();
};

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
  return await enrollmentService.getUserTournamentInfo(
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
