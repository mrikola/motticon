import { Cube } from "./Cube";

export type Round = {
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
};

export type Tournament = {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  cubes: Cube[];
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
