import { useEffect } from "react";
import { ProgressBar } from "react-bootstrap";

type Props = {
  remainingMatches: number;
  totalMatches: number;
};

function MatchesRemainingProgressBar({
  remainingMatches,
  totalMatches,
}: Props) {
  useEffect(() => {}, []);
  const now = 100 - (remainingMatches / totalMatches) * 100;

  return (
    <>
      <ProgressBar
        striped
        variant="primary"
        now={now}
        label={`Round ${now}% done`}
      />
      <p className="lead">
        {remainingMatches}/{totalMatches} matches left
      </p>
    </>
  );
}

export default MatchesRemainingProgressBar;
