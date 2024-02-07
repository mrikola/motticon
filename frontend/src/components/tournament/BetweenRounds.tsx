type Props = {
  latestRoundNumber: number;
  lastRoundNumber: number;
};

function BetweenRounds({ latestRoundNumber, lastRoundNumber }: Props) {
  return (
    <>
      <h3>Round {latestRoundNumber} done.</h3>
      {lastRoundNumber > latestRoundNumber && (
        <h3>Waiting for round {latestRoundNumber + 1} to start.</h3>
      )}
    </>
  );
}

export default BetweenRounds;
