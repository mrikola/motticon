export type Tournament = {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
};

export type UsersTournaments = {
  past: Tournament[];
  ongoing: Tournament[];
  future: Tournament[];
};
