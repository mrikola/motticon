import { useEffect } from "react";
import { ProgressBar } from "react-bootstrap";

type Props = {
  remainingSubmissions: number;
  totalPlayers: number;
};

function DecksSubmittedProgressBar({
  remainingSubmissions,
  totalPlayers,
}: Props) {
  useEffect(() => {}, []);
  const now = 100 - (remainingSubmissions / totalPlayers) * 100;

  return (
    <>
      <ProgressBar
        striped
        variant="primary"
        now={now}
        label={`Submissions ${now}% done`}
      />
      <p className="lead">
        {remainingSubmissions}/{totalPlayers} submissions left
      </p>
    </>
  );
}

export default DecksSubmittedProgressBar;
