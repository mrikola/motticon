import { Cube } from "./Cube";
import { Player, User } from "./User";

export type Round = {
  id: number;
  roundNumber: number;
  startTime: Date;
};

export type Draft = {
  id: number;
  draftNumber: number;
};

export type DraftPod = {
  id: number;
  draftId: number;
  draft: Draft;
  podNumber: number;
  cubeId: number;
  cube: Cube;
  seats: DraftPodSeat[];
};

export type DraftPodSeat = {
  id: number;
  podId: number;
  pod: DraftPod;
  playerId: number;
  player: User;
  seat: number;
  deckPhotoUrl: string;
};

export type Match = {
  id: number;
  tableNumber: number;
  player1GamesWon: number;
  player2GamesWon: number;
  player1: Player;
  player2: Player;
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
  status: string;
  cubes: Cube[];
  staffMembers: User[];
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
