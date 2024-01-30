import { useEffect, useState } from "react";
import { Draft, Round, Tournament } from "../../types/Tournament";
import { get } from "../../services/ApiService";
import { Col, Row } from "react-bootstrap";

type Props = {
  tournamentId: number;
  latestRound: Round;
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
      {lastCompletedDraft?.draftNumber === tournament?.drafts.length ? (
        <Row>
          <Col xs={12}>
            <h3>All drafts done.</h3>
            <p className="lead">
              Waiting for tournament organizer to complete tournament.
            </p>
          </Col>
        </Row>
      ) : firstPendingDraft ? (
        <Row>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
            <h3>
              Waiting for draft {firstPendingDraft?.draftNumber} to begin.
            </h3>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
            <p>test 2</p>
          </Col>
        </Row>
      )}
    </>
  );
};

export default PendingView;
