import { Enrollment } from "../entity/Enrollment";
import { Preference } from "../entity/Preference";
import { Tournament } from "../entity/Tournament";

export type PlayerTournamentInfo = {
  tournament: Tournament;
  enrollment: Enrollment;
  preferences: Preference[];
};

export type TournamentsByType = {
  past: Tournament[];
  ongoing: Tournament[];
  future: Tournament[];
};
