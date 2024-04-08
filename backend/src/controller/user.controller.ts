import {
  PlayerTournamentInfo,
  TournamentDto,
  tournamentToDto,
} from "../dto/tournaments.dto";
import {
  PlayerDto,
  PlayerWithRatingDto,
  playerToDto,
  playerToRatedDto,
} from "../dto/user.dto";
import { EnrollmentService } from "../service/enrollment.service";
import { UserService } from "../service/user.service";

const userService = new UserService();
const enrollmentService = new EnrollmentService();

export const signup = async (req): Promise<boolean> => {
  const { firstName, lastName, email, password } = req.body;
  return await userService.createUser(firstName, lastName, email, password);
};

export const getUser = async (req): Promise<PlayerWithRatingDto> => {
  const { id } = req.params;
  return playerToRatedDto(await userService.getUser(id as number));
};

export const getAllUsers = async (): Promise<PlayerWithRatingDto[]> => {
  return (await userService.getAllUsers()).map(playerToRatedDto);
};

export const getUsersTournaments = async (req): Promise<TournamentDto[]> => {
  const { id } = req.params;
  return (await userService.getUsersTournaments(id as number)).map(
    tournamentToDto
  );
};

export const getTournamentsStaffed = async (req): Promise<TournamentDto[]> => {
  const { userId } = req.params;
  return (await userService.getTournamentsStaffed(userId as number)).map(
    tournamentToDto
  );
};

export const getUserTournamentInfo = async (
  req
): Promise<PlayerTournamentInfo> => {
  const { userId, tournamentId } = req.params;
  return await enrollmentService.getUserTournamentInfo(
    userId,
    tournamentId as number
  );
};

export const userExists = async (req) => {
  const { email } = req.params;
  return await userService.userExists(email);
};

export const setCubePreferences = async (req): Promise<boolean> => {
  const preferences = req.body;
  return await userService.setCubePreferences(preferences);
};

export const deleteCubePreferences = async (req): Promise<boolean> => {
  const preferences = req.body;
  return await userService.deleteCubePreferences(preferences);
};
