import { Button, Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  onHide: () => void;
  heading: string;
  text: string;
  actionFunction: () => void;
  actionText: string;
};

function VerticallyCenteredModal({
  show,
  onHide,
  heading,
  text,
  actionFunction,
  actionText,
}: Props) {
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
        <Button onClick={actionFunction}>{actionText}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VerticallyCenteredModal;
