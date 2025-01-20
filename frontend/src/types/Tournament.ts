import { Cube } from "./Cube";
import { Enrollment, Player, User } from "./User";

export type Status = "pending" | "started" | "completed";

export type Round = {
  id: number;
  roundNumber: number;
  startTime: Date;
  status: Status;
  matches?: Match[];
};

export type Draft = {
  id: number;
  draftNumber: number;
  status: Status;
  pods: DraftPod[];
  firstRound: number;
  lastRound: number;
  startTime?: Date;
};

export type DraftPod = {
  id: number;
  draftId?: number;
  draft?: Draft;
  podNumber: number;
  cubeId?: number;
  cube?: Cube;
  seats: DraftPodSeat[];
};

export type DraftPodSeat = {
  id: number;
  podId?: number;
  pod?: DraftPod;
  playerId?: number;
  player: User | null;
  seat: number;
  deckPhotoUrl: string | null;
  draftPoolReturned: boolean;
};

export type Match = {
  id: number;
  tableNumber: number;
  player1GamesWon: number;
  player2GamesWon: number;
  player1: Player;
  player2: Player;
  resultSubmittedBy?: Player;
  playerGoingFirst?: Player;
};

export type Tournament = {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  entryFee: number;
  totalSeats: number;
  preferencesRequired: number;
  status: Status;
  drafts: Draft[];
  cubes: Cube[];
  staffMembers: User[];
  enrollments: Enrollment[];
  userEnrollmentEnabled: boolean;
};

export type TournamentsByType = {
  past: Tournament[];
  ongoing: Tournament[];
  future: Tournament[];
};

export type UsersTournaments = {
  past: Tournament[];
  ongoing: Tournament[];
  future: Tournament[];
};

export type PlayerTournamentScore = {
  playerId?: number;
  tournamentId?: number;
  player?: User;
  tournament?: Tournament;
  points: number;
  draftsWon: number;
  opponentMatchWinPercentage: number;
};

export type StandingsRow = {
  playerId: number;
  firstName: string;
  lastName: string;
  matchPoints: number;
  draftsWon: number;
  opponentMatchWinPercentage: number;
};
