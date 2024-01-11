import { TournamentService } from "../service/tournament.service";

const tournamentService = new TournamentService();

export const getAllTournaments = async () => {
  return await tournamentService.getAllTournaments();
};

export const getTournament = async (req) => {
  const { id } = req.params;
  return await tournamentService.getTournament(id as number);
};

export const getTournamentCubes = async (req) => {
  const { id } = req.params;
  return await tournamentService.getTournamentCubes(id as number);
};

export const getCurrentDraft = async (req) => {
  const { id } = req.params;
  return await tournamentService.getCurrentDraft(id as number);
};

export const getCurrentRound = async (req) => {
  const { id } = req.params;
  return await tournamentService.getCurrentRound(id as number);
};

export const enrollIntoTournament = async (req) => {
  const { tournamentId, userId } = req.params;
  return await tournamentService.enrollIntoTournament(
    tournamentId as number,
    userId as number
  );
};
