import { useEffect, useState } from "react";
import { Draft, Tournament } from "../../types/Tournament";
import { get, post, put } from "../../services/ApiService";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";

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
          .find((draft) => draft.status === "pending"),
      );

      setLastCompletedDraft(
        drafts
          .sort((a, b) => b.draftNumber - a.draftNumber)
          .find((draft) => draft.status === "completed"),
      );
    };

    fetchData();
  }, [tournamentId, JSON.stringify(tournament)]);

  const generateDraft = async () => {
    const response = await post(
      `/tournament/${tournamentId}/draft/generate`,
      {},
    );
    const updatedTournament = (await response.json()) as Tournament;
    if (updateTournament !== null) {
      // todo: create better alert when multiple drafts are created
      toast.success("Draft pods generated");
      setTournament({ ...tournament, ...updatedTournament });
    }
  };

  const initiateDraft = async () => {
    const response = await put(
      `/tournament/${tournamentId}/draft/${firstPendingDraft?.id}/initiate`,
      {},
    );
    const draft = (await response.json()) as Draft;
    if (draft !== null) {
      toast.success("Draft " + draft.draftNumber + " initiated");
      setCurrentDraft(draft);
    }
  };

  const completeTournament = async () => {
    const resp = await put(`/tournament/${tournamentId}/end`);
    const updatedTournament = (await resp.json()) as Tournament;
    if (updateTournament !== null) {
      setTournament({ ...updatedTournament });
      updateTournament(updatedTournament);
      toast.success("Tournament completed");
    }
  };

  // if latest draft completed == tournament draft count, tournament is over (minus top 8)
  // else if next draft pending == null, we need to generate the draft and pods
  // else we can start the next draft
  // next = (latest completed ?? 0) + 1

  return (
    <>
      {lastCompletedDraft?.draftNumber === tournament?.drafts.length ? (
        <Row>
          <h3>The tournament is over.</h3>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
            <Button
              variant="info"
              className="btn-lg text-light"
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
                variant="info"
                className="btn-lg text-light"
                onClick={() => initiateDraft()}
              >
                Initiate next draft
              </Button>
            ) : (
              <Button
                variant="info"
                className="btn-lg text-light"
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
              variant="info"
              className="btn-lg text-light"
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
