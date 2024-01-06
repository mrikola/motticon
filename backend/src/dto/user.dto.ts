import { Tournament } from "../entity/Tournament"

// TODO make DTO for tournament
export type UsersTournaments {
  past: Tournament[];
  ongoing: Tournament[];
  future: Tournament[];
}