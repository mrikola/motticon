import { Cube } from "./Cube";
import { Tournament } from "./Tournament";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
  rating?: number;
  email: string;
};

export type Player = User;

export type Enrollment = {
  player?: Player;
  tournament?: Tournament;
  dropped: boolean;
  paid: boolean;
};

export type UserCubePreference = {
  playerId: number;
  tournamentId: number;
  cubeId: number;
  points: number;
};

export type Preference = {
  id: number;
  tournamentId: number;
  tournament: Tournament;
  playerId: number;
  player: User;
  cube: Cube;
  points: number;
};
