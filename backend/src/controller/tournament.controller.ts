import { TournamentService } from "../service/tournament.service";

const tournamentService = new TournamentService();

export const getAllTournaments = async () => {
  return await tournamentService.getAllTournaments();
};

export const getTournament = async (req) => {
  const { id } = req.params;
  return await tournamentService.getTournament(id as number);
};
