import { Button, Modal } from "react-bootstrap";
import { DraftPodSeat } from "../../types/Tournament";

export type DeckBuildingModalProps = {
  show: boolean;
  onHide: () => void;
  heading: string;
  text: string;
  actionFunction: (seat: DraftPodSeat) => void;
  actionText: string;
  seat: DraftPodSeat;
};

function DeckBuildingModal({
  show,
  onHide,
  heading,
  text,
  actionFunction,
  actionText,
  seat,
}: DeckBuildingModalProps) {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{text}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant="danger">
          Back
        </Button>
        <Button
          variant="info"
          className="btn text-light"
          onClick={() => actionFunction(seat)}
        >
          {actionText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeckBuildingModal;
