import { describe } from "node:test";
import { Tournament } from "../entity/Tournament";
import { CubeDto, cubeToDto } from "./cube.dto";
import { DraftDto, draftToDto } from "./draft.dto";
import { TournamentStatus } from "./general.dto";
import {
  EnrollmentDto,
  PlayerDto,
  PreferenceDto,
  enrollmentToDto,
  playerToDto,
} from "./user.dto";

export type TournamentDto = {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  entryFee: number;
  totalSeats: number;
  preferencesRequired: number;
  status: TournamentStatus;
  drafts: DraftDto[];
  enrollments: EnrollmentDto[];
  cubes: CubeDto[];
  staffMembers: PlayerDto[];
};

export type PlayerTournamentInfo = {
  tournament: TournamentDto;
  enrollment: EnrollmentDto;
  preferences: PreferenceDto[];
};

export type TournamentsByType = {
  past: TournamentDto[];
  ongoing: TournamentDto[];
  future: TournamentDto[];
};

export const tournamentToDto = (tournament: Tournament): TournamentDto => ({
  id: tournament.id,
  name: tournament.name,
  description: tournament.description,
  startDate: tournament.startDate,
  endDate: tournament.endDate,
  entryFee: tournament.entryFee,
  totalSeats: tournament.totalSeats,
  preferencesRequired: tournament.preferencesRequired,
  status: tournament.status,
  drafts: tournament.drafts.map(draftToDto),
  enrollments: tournament.enrollments.map(enrollmentToDto),
  cubes: tournament.cubes.map(cubeToDto),
  staffMembers: tournament.staffMembers.map(playerToDto),
});
