import { Draft } from "../../types/Tournament";

type Props = {
  latestRoundNumber: number;
  lastRoundNumber: number;
  draft: Draft;
};

function BetweenRounds({ latestRoundNumber, lastRoundNumber, draft }: Props) {
  return (
    <>
      <h3>Round {latestRoundNumber} done.</h3>
      {lastRoundNumber > latestRoundNumber && (
        <h3>Waiting for round {latestRoundNumber + 1} to start.</h3>
      )}
      {draft.lastRound === latestRoundNumber && (
        <h3>
          Draft {draft.draftNumber} done. Waiting for tournament organizer to
          complete draft.
        </h3>
      )}
    </>
  );
}

export default BetweenRounds;
