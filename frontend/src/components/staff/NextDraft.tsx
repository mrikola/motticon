import { useEffect, useState } from "react";
import { Draft, Tournament } from "../../types/Tournament";
import { get } from "../../services/ApiService";
import { Button, Col, Row } from "react-bootstrap";

type Props = {
  tournamentId: number;
  setCurrentDraft: (draft: Draft) => void;
};

const NextDraft = ({ tournamentId, setCurrentDraft }: Props) => {
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
  }, [tournamentId, firstPendingDraft?.id]);

  // if latest draft completed == tournament draft count, tournament is over (minus top 8)
  // else if next draft pending == null, we need to generate the draft and pods
  // else we can start the next draft
  // next = (latest completed ?? 0) + 1

  return (
    <Row>
      <Col xs={12}>
        <p>Last completed draft: {lastCompletedDraft?.draftNumber ?? "N/A"}</p>
        <p>Next pending draft: {firstPendingDraft?.draftNumber ?? "N/A"}</p>
        <p>How many drafts: {tournament?.drafts.length ?? "N/A"}</p>
        {lastCompletedDraft?.draftNumber === tournament?.drafts.length ? (
          <p>The tournament is over</p>
        ) : firstPendingDraft ? (
          <>
            {firstPendingDraft.pods.length ? (
              <Button>Start next draft</Button>
            ) : (
              <Button variant="primary">Generate draft pods</Button>
            )}
          </>
        ) : (
          <Button>Generate next draft</Button>
        )}
      </Col>
    </Row>
  );
};

export default NextDraft;
