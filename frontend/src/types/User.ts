export type User = {
  id: number;
  firstName: string;
  lastName: string;
};

export type Player = User;

export type Enrollment = {
  playerId: number;
  tournamentId: number;
  dropped: boolean;
  paid: boolean;
};
