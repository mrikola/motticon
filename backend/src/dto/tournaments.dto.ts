import { Tournament } from "../entity/Tournament"

export type TournamentsByType {
  past: Tournament[];
  ongoing: Tournament[];
  future: Tournament[];
}