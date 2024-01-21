import { EnrollmentService } from "../service/enrollment.service";
import { TournamentService } from "../service/tournament.service";

const tournamentService = new TournamentService();
const enrollmentService = new EnrollmentService();

export const createTournament = async (req) => {
  const {
    name,
    description,
    price,
    players,
    drafts,
    preferencesRequired,
    startDate,
    endDate,
    cubeIds,
  } = req.body;
  return await tournamentService.createTournament(
    name,
    description,
    price,
    players,
    drafts,
    preferencesRequired,
    startDate,
    endDate,
    cubeIds
  );
};

export const getAllTournaments = async () => {
  return await tournamentService.getAllTournaments();
};

export const getOngoingTournaments = async () => {
  return await tournamentService.getOngoingTournaments();
};

export const getFutureTournaments = async () => {
  return await tournamentService.getFutureTournaments();
};

export const getPastTournaments = async () => {
  return await tournamentService.getPastTournaments();
};

export const getTournament = async (req) => {
  const { tournamentId } = req.params;
  return await tournamentService.getTournament(tournamentId as number);
};

export const getTournamentAndDrafts = async (req) => {
  const { tournamentId } = req.params;
  return await tournamentService.getTournamentAndDrafts(tournamentId as number);
};

export const getCurrentDraft = async (req) => {
  const { tournamentId } = req.params;
  return await tournamentService.getCurrentDraft(tournamentId as number);
};

export const getCurrentRound = async (req) => {
  const { tournamentId } = req.params;
  return await tournamentService.getCurrentRound(tournamentId as number);
};

export const resetRecentMatchesForTournament = async (req) => {
  const { tournamentId } = req.params;
  return await tournamentService.resetRecentMatchesForTournament(
    tournamentId as number
  );
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
