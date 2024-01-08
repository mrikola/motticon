export type Tournament = {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  cubes: cube[];
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
