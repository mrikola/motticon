import { useEffect, useState } from "react";
import { Draft, Tournament } from "../../types/Tournament";
import { get, post, put } from "../../services/ApiService";
import { Button, Col, Row } from "react-bootstrap";

type Props = {
  tournamentId: number;
  setCurrentDraft: (draft?: Draft) => void;
  updateTournament: (tournament: Tournament) => void;
};

const NextDraft = ({
  tournamentId,
  setCurrentDraft,
  updateTournament,
}: Props) => {
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

  const generateDraft = async () => {
    const response = await post(
      `/tournament/${tournamentId}/draft/generate`,
      {}
    );
    const updatedTournament = (await response.json()) as Tournament;

    setTournament({ ...tournament, ...updatedTournament });
  };

  const initiateDraft = async () => {
    const response = await put(
      `/tournament/${tournamentId}/draft/${firstPendingDraft?.id}/initiate`,
      {}
    );
    // const updatedTournament = (await response.json()) as Tournament;
    const draft = (await response.json()) as Draft;
    setCurrentDraft(draft);
    // setCurrentDraft(
    //   updatedTournament.drafts.find(
    //     (draft) => draft.id === firstPendingDraft?.id
    //   )
    // );
  };

  const completeTournament = async () => {
    const resp = await put(`/tournament/${tournamentId}/end`);
    const updatedTournament = (await resp.json()) as Tournament;
    setTournament({ ...updatedTournament });
    updateTournament(updatedTournament);
  };

  // if latest draft completed == tournament draft count, tournament is over (minus top 8)
  // else if next draft pending == null, we need to generate the draft and pods
  // else we can start the next draft
  // next = (latest completed ?? 0) + 1

  return (
    <>
      <Row>
        <Col xs={12}>
          <p>
            Last completed draft: {lastCompletedDraft?.draftNumber ?? "N/A"}
          </p>
          <p>Next pending draft: {firstPendingDraft?.draftNumber ?? "N/A"}</p>
          <p>How many drafts: {tournament?.drafts.length ?? "N/A"}</p>
        </Col>
      </Row>
      {lastCompletedDraft?.draftNumber === tournament?.drafts.length ? (
        <Row>
          <h3>The tournament is over.</h3>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
            <Button
              variant="primary"
              className="btn-lg"
              onClick={() => completeTournament()}
            >
              Complete tournament
            </Button>
          </Col>
        </Row>
      ) : firstPendingDraft ? (
        <Row>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
            {firstPendingDraft.pods.length ? (
              <Button
                variant="primary"
                className="btn-lg"
                onClick={() => initiateDraft()}
              >
                Initiate next draft
              </Button>
            ) : (
              <Button
                variant="primary"
                className="btn-lg"
                onClick={() => generateDraft()}
              >
                Generate draft pods
              </Button>
            )}
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
            <Button
              variant="primary"
              className="btn-lg"
              onClick={() => generateDraft()}
            >
              Generate drafts
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default NextDraft;
