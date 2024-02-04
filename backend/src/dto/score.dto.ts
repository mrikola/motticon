export type PlayerTournamentHistory = {
  id: number;
  gamesWon: number;
  gamesPlayed: number;
  matchPoints: number;
  matchesPlayed: number;
  matchPointPercentage: number;
  opponentIds: number[];
};

export type RecordByPlayer = Map<number, PlayerTournamentHistory>;

export type StandingsRow = {
  playerId: number;
  firstName: string;
  lastName: string;
  matchPoints: number;
  draftsWon: number;
  opponentMatchWinPercentage: number;
};
