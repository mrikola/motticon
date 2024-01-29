import { useEffect, useState } from "react";
import { Draft, Tournament } from "../../types/Tournament";
import { get } from "../../services/ApiService";
import { Button, Col, Row } from "react-bootstrap";

type Props = {
  tournamentId: number;
};

const PendingView = ({ tournamentId }: Props) => {
  const [lastCompletedDraft, setLastCompletedDraft] = useState<Draft>();
  const [firstPendingDraft, setFirstPendingDraft] = useState<Draft>();
  const [tournament, setTournament] = useState<Tournament>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/drafts`);
      const tournament = (await resp.json()) as Tournament;
      setTournament(tournament);

      const drafts = tournament.drafts ?? [];
      setFirstPendingDraft(
        drafts
          .sort((a, b) => a.draftNumber - b.draftNumber)
          .find((draft) => draft.status === "pending")
      );

      setLastCompletedDraft(
        drafts
          .sort((a, b) => b.draftNumber - a.draftNumber)
          .find((draft) => draft.status === "completed")
      );
    };

    fetchData();
  }, [tournamentId, JSON.stringify(tournament)]);

  // if latest draft completed == tournament draft count, tournament is over (minus top 8)
  // else if next draft pending == null, we need to generate the draft and pods
  // else we can start the next draft
  // next = (latest completed ?? 0) + 1

  return (
    <>
      <Row>
        <Col xs={12}>
          <h2>Tournament started, waiting.</h2>
        </Col>
      </Row>
      {!lastCompletedDraft?.draftNumber ? (
        <Row>
          <Col xs={12}>
            <h3>
              Waiting for draft {firstPendingDraft?.draftNumber} to begin.
            </h3>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xs={12}>
            <h3>
              Waiting for draft {firstPendingDraft?.draftNumber} to begin.
            </h3>
          </Col>
        </Row>
      )}
      {lastCompletedDraft?.draftNumber === tournament?.drafts.length ? (
        <Row>
          <h3>The tournament is over.</h3>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto"></Col>
        </Row>
      ) : firstPendingDraft ? (
        <Row>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto"></Col>
        </Row>
      ) : (
        <Row>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto"></Col>
        </Row>
      )}
    </>
  );
};

export default PendingView;
