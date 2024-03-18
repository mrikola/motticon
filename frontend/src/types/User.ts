export type User = {
  id: number;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  rating: number;
};

export type Player = User;

export type Enrollment = {
  player: Player;
  tournamentId: number;
  dropped: boolean;
  paid: boolean;
};

export type UserCubePreference = {
  playerId: number;
  tournamentId: number;
  cubeId: number;
  points: number;
};
