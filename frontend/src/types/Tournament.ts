import { Cube } from "./Cube";
import { Player, User } from "./User";

export type Round = {
  id: number;
  roundNumber: number;
  startTime: Date;
};

export type Draft = {
  draftNumber: number;
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
