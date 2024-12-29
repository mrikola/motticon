import { Enrollment } from "../entity/Enrollment";
import { PlayerTournamentScore } from "../entity/PlayerTournamentScore";
import { Preference } from "../entity/Preference";
import { User } from "../entity/User";
import { CubeDto, cubeToDto } from "./cube.dto";
import { TournamentDto, tournamentToDto } from "./tournaments.dto";

export type PlayerDto = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type PlayerWithRatingDto = PlayerDto & {
  rating: number;
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

export type UserCubePreferenceDto = {
  playerId: number;
  tournamentId: number;
  cubeId: number;
  points: number;
};

export type PlayerTournamentScoreDto = {
  player: PlayerDto;
  tournament: TournamentDto;
  points: number;
  draftsWon: number;
  opponentMatchWinPercentage: number;
};

export const playerToDto = (player: User): PlayerDto =>
  player
    ? {
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        email: player.email,
      }
    : undefined;

export const playerToRatedDto = (player: User): PlayerWithRatingDto =>
  player
    ? {
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        email: player.email,
        rating: player.rating,
      }
    : undefined;

export const enrollmentToDto = (enrollment: Enrollment): EnrollmentDto =>
  enrollment
    ? {
        id: enrollment.id,
        tournament: tournamentToDto(enrollment.tournament),
        player: playerToDto(enrollment.player),
        paid: enrollment.paid,
        dropped: enrollment.dropped,
      }
    : undefined;

export const preferenceToDto = (preference: Preference): PreferenceDto =>
  preference
    ? {
        id: preference.id,
        tournament: tournamentToDto(preference.tournament),
        player: playerToDto(preference.player),
        cube: cubeToDto(preference.cube),
        points: preference.points,
      }
    : undefined;

export const scoreToDto = (score: PlayerTournamentScore): PlayerTournamentScoreDto =>
  score
    ? {
        player: playerToDto(score.player),
        tournament: tournamentToDto(score.tournament),
        points: score.points,
        draftsWon: score.draftsWon,
        opponentMatchWinPercentage: Number(score.opponentMatchWinPercentage),
      }
    : undefined;

