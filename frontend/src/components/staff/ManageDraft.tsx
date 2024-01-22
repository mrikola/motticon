import { Button, Col, Row } from "react-bootstrap";
import { Draft, Match, Round, Tournament } from "../../types/Tournament";
import DecksSubmittedProgressBar from "./DecksSubmittedProgressBar";
import DecksSubmittedTable from "./DecksSubmittedTable";
import { useEffect, useState } from "react";
import { get, put } from "../../services/ApiService";
import { useParams } from "react-router";

type Props = {
  currentDraft: Draft;
  setCurrentRound: (round: Round) => void;
};

const ManageDraft = ({ currentDraft, setCurrentRound }: Props) => {
  // get rounds for this draft, look at their statuses and matches generated
  // find last completed round and first pending round
  // if last round completed == draft last round, draft is over
  // else if next round pending has no matches, we need to generate pairings
  // if next round pending DOES have matches, we can start the round
  // when round is started, set current round in StaffView (check NextDraft)
  const { tournamentId } = useParams();
  const [lastCompletedRound, setLastCompletedRound] = useState<Round>();
  const [firstPendingRound, setFirstPendingRound] = useState<Round>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/draft/${currentDraft.id}/rounds`);
      const rounds: Round[] = ((await resp.json()) ?? []) as Round[];

      console.log("rounds", JSON.stringify(rounds, null, 2));

      setFirstPendingRound(
        rounds
          .sort((a, b) => a.roundNumber - b.roundNumber)
          .find((round) => round.status === "pending")
      );

      setLastCompletedRound(
        rounds
          .sort((a, b) => b.roundNumber - a.roundNumber)
          .find((round) => round.status === "completed")
      );
    };

    fetchData();
  }, [currentDraft.id]);

  const generatePairings = async () => {
    const resp = await put(
      `/tournament/${tournamentId}/draft/${currentDraft.id}/round/${firstPendingRound?.id}/pairings`
    );
    const matches = (await resp.json()) as Match[];
    setFirstPendingRound({ ...firstPendingRound!, matches });
  };

  const startRound = async () => {
    if (firstPendingRound) {
      const response = await put(
        `/tournament/${tournamentId}/round/${firstPendingRound?.id}/start`,
        {}
      );
      const round = (await response.json()) as Round;
      setCurrentRound(round);
    }
  };

  return (
    <Row>
      <Col xs={12}>
        <p>Last completed round: {lastCompletedRound?.roundNumber ?? "N/A"}</p>
        <p>Next pending round: {firstPendingRound?.roundNumber ?? "N/A"}</p>
        <p>
          Which rounds: {currentDraft.firstRound} - {currentDraft.lastRound}
        </p>
        {lastCompletedRound?.roundNumber === currentDraft.lastRound ? (
          <p>
            The draft is over.
            <Button variant="primary">Complete draft</Button>
          </p>
        ) : firstPendingRound ? (
          <>
            {firstPendingRound.matches.length ? (
              <Button variant="primary" onClick={() => startRound()}>
                Start next round
              </Button>
            ) : (
              <Button variant="primary" onClick={() => generatePairings()}>
                Generate pairings
              </Button>
            )}
          </>
        ) : (
          <p>Something's wrong, there are no rounds generated for this draft</p>
        )}
      </Col>
    </Row>
  );
};

export default ManageDraft;
