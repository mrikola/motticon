import { Enrollment } from "../entity/Enrollment";
import { Preference } from "../entity/Preference";
import { User } from "../entity/User";
import { CubeDto, cubeToDto } from "./cube.dto";
import { TournamentDto, tournamentToDto } from "./tournaments.dto";

export type PlayerDto = {
  id: number;
  firstName: string;
  lastName: string;
};

export type EnrollmentDto = {
  id: number;
  tournament: TournamentDto;
  player: PlayerDto;
  paid: boolean;
  dropped: boolean;
};

export type PreferenceDto = {
  id: number;
  tournament: TournamentDto;
  player: PlayerDto;
  cube: CubeDto;
  points: number;
};

export type PlayerTournamentScoreDto = {
  player: PlayerDto;
  tournament: TournamentDto;
  points: number;
  draftsWon: number;
  opponentMatchWinPercentage: number;
};

export const playerToDto = (player: User): PlayerDto => ({
  id: player.id,
  firstName: player.firstName,
  lastName: player.lastName,
});

export const enrollmentToDto = (enrollment: Enrollment): EnrollmentDto => ({
  id: enrollment.id,
  tournament: tournamentToDto(enrollment.tournament),
  player: playerToDto(enrollment.player),
  paid: enrollment.paid,
  dropped: enrollment.dropped,
});

export const preferenceToDto = (preference: Preference): PreferenceDto => ({
  id: preference.id,
  tournament: tournamentToDto(preference.tournament),
  player: playerToDto(preference.player),
  cube: cubeToDto(preference.cube),
  points: preference.points,
});
