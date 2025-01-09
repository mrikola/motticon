import { Tournament } from "../types/Tournament";
import { LoggedInUser } from "./auth";

export const isUserTournamentStaff = (user: LoggedInUser | null, tournamentId: number): boolean => 
  user?.isAdmin || user?.tournamentsStaffed.includes(tournamentId) || false;

export const calculateFreeSeats = (tournament: Tournament): number =>
  tournament.totalSeats - (tournament.enrollments?.length ?? 0);

export const hasPreferencesRequired = (tournament: Tournament): boolean =>
  tournament.status === "pending" && tournament.preferencesRequired > 0; 