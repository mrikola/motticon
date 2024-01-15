import { EnrollmentService } from "../service/enrollment.service";
import { TournamentService } from "../service/tournament.service";

const tournamentService = new TournamentService();
const enrollmentService = new EnrollmentService();

export const getAllTournaments = async () => {
  return await tournamentService.getAllTournaments();
};

export const getTournament = async (req) => {
  const { tournamentId } = req.params;
  return await tournamentService.getTournament(tournamentId as number);
};

export const getCurrentDraft = async (req) => {
  const { tournamentId } = req.params;
  return await tournamentService.getCurrentDraft(tournamentId as number);
};

export const getCurrentRound = async (req) => {
  const { tournamentId } = req.params;
  return await tournamentService.getCurrentRound(tournamentId as number);
};

export const enrollIntoTournament = async (req) => {
  const { tournamentId, userId } = req.params;
  return await enrollmentService.enrollIntoTournament(
    tournamentId as number,
    userId as number
  );
};

export const cancelEnrollment = async (req) => {
  const { tournamentId, userId } = req.params;
  return await enrollmentService.cancelEnrollment(
    tournamentId as number,
    userId as number
  );
};

export const dropFromTournament = async (req) => {
  const { tournamentId, userId } = req.params;
  return await enrollmentService.dropFromTournament(
    tournamentId as number,
    userId as number
  );
};
