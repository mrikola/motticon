import { DraftPodSeat } from "../entity/DraftPodSeat";
import { Match } from "../entity/Match";
import { Round } from "../entity/Round";

export type CurrentMatchAndDraft = {
  draftSeat: DraftPodSeat;
  match: Match;
  round: Round;
};
