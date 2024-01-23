import { Button, Modal } from "react-bootstrap";

export type VerticallyCenteredModalProps = {
  show: boolean;
  onHide: () => void;
  heading: string;
  text: string;
  text2?: string;
  text3?: string;
  actionFunction: () => void;
  actionText: string;
};

function VerticallyCenteredModal({
  show,
  onHide,
  heading,
  text,
  text2,
  text3,
  actionFunction,
  actionText,
}: VerticallyCenteredModalProps) {
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
        {text2 && <p>{text2}</p>}
        {text3 && <p>{text3}</p>}
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
