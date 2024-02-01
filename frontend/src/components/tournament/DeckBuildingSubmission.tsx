import { Button, Col, Row } from "react-bootstrap";
import VerticallyCenteredModal, {
  VerticallyCenteredModalProps,
} from "../general/VerticallyCenteredModal";
import { useState } from "react";
import { Draft, DraftPodSeat } from "../../types/Tournament";
import { post } from "../../services/ApiService";

type Props = {
  seat: DraftPodSeat;
  tournamentId: number;
  done: boolean;
  setDone: (value: boolean) => void;
  setDraft: (draft: Draft) => void;
};

function DeckBuildingSubmission({
  seat,
  tournamentId,
  done,
  setDone,
  setDraft,
}: Props) {
  const [modal, setModal] = useState<VerticallyCenteredModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
  });

  function markDone() {
    if (seat) {
      const seatId = seat.id;
      post(`/setDeckPhoto`, {
        tournamentId,
        seatId,
      }).then(async (resp) => {
        const draft = (await resp.json()) as Draft;
        if (draft !== null) {
          console.log(draft);
          setDone(true);
          setDraft(draft);
          setModal({
            ...modal,
            show: false,
          });
        }
      });
    } else {
      console.log("error");
    }
  }

  function handleDoneClick() {
    setModal({
      show: true,
      onHide: () => null,
      heading: "Confirm deck building done",
      text: "Are you sure you want to confirm your deck building is done?",
      actionText: "Confirm done",
      actionFunction: markDone,
    });
  }
  return (
    <Row>
      {done ? (
        <Row>
          <h2>Your deck building done.</h2>
          <p>Waiting for other players to submit their decks.</p>
          <Col className="d-grid gap-2">
            <Button
              variant="primary"
              className="btn-lg"
              onClick={handleDoneClick}
              disabled={done}
            >
              Your deck building done
            </Button>
          </Col>
        </Row>
      ) : (
        <Row>
          <h2>Deck building</h2>
          <p>Click the button to confirm you are done with deck building.</p>
          <Col className="d-grid gap-2">
            <Button
              variant="primary"
              className="btn-lg"
              onClick={handleDoneClick}
              disabled={done}
            >
              Complete deck building
            </Button>
          </Col>
        </Row>
      )}

      <VerticallyCenteredModal
        show={modal.show}
        onHide={() =>
          setModal({
            ...modal,
            show: false,
          })
        }
        heading={modal.heading}
        text={modal.text}
        actionText={modal.actionText}
        actionFunction={modal.actionFunction}
      />
    </Row>
  );
}

export default DeckBuildingSubmission;
