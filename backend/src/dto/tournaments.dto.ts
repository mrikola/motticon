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
import { Cube } from "../entity/Cube";
import { User } from "../entity/User";
import { TournamentCube } from "../entity/TournamentCube";

export type TournamentCubeDto = {
  tournament: TournamentDto;
  cube: CubeDto;
  count: number;
};

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
  userEnrollmentEnabled: boolean;
  enrollments: EnrollmentDto[];
  cubeAllocations: TournamentCubeDto[];
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

export type PreferencesByPlayer = {
  [key: string]: {
    player: number;
    cube: number;
    points: number;
    used: boolean;
  }[];
};

export type DraftPodGenerationStrategy =
  | "greedy"
  | "sparing"
  | "middle"
  | "semi-greedy"
  | "third"
  | "fourth"
  | "fifth"
  | "sixth"
  | "seventh";

export type PreferentialPodAssignments = {
  preferencePoints: number;
  penaltyPoints: number;
  penaltyReasons: string[];
  algorithmType: string;
  strategy: DraftPodGenerationStrategy[];
  assignments: {
    draftNumber: number;
    pods: {
      cube: Cube;
      players: User[];
    }[];
  }[];
};

export const cubeAllocationToDto = (tc: TournamentCube): TournamentCubeDto => ({
  tournament: tc.tournament,
  cube: tc.cube,
  count: tc.count,
});

export const tournamentToDto = (tournament: Tournament): TournamentDto =>
  tournament
    ? {
        id: tournament.id,
        name: tournament.name,
        description: tournament.description,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        entryFee: tournament.entryFee,
        totalSeats: tournament.totalSeats,
        preferencesRequired: tournament.preferencesRequired,
        status: tournament.status,
        drafts: tournament.drafts?.map(draftToDto) ?? [],
        userEnrollmentEnabled: tournament.userEnrollmentEnabled,
        enrollments: tournament.enrollments?.map(enrollmentToDto) ?? [],
        cubeAllocations:
          tournament.cubeAllocations?.map(cubeAllocationToDto) ?? [],
        staffMembers: tournament.staffMembers?.map(playerToDto) ?? [],
      }
    : undefined;
