export type User = {
  id: number;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
};

export type Player = User;

export type Enrollment = {
  player: Player;
  tournamentId: number;
  dropped: boolean;
  paid: boolean;
};
