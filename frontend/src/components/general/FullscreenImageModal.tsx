import { Button, Col, Container, Modal, Row } from "react-bootstrap";

export type FullscreenImageModalProps = {
  show: boolean;
  onHide: () => void;
  heading: string;
  imageUrl: string;
};

function FullscreenImageModal({
  show,
  onHide,
  heading,
  imageUrl,
}: FullscreenImageModalProps) {
  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      show={show}
      onHide={onHide}
      fullscreen={true}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={imageUrl} className="img-fluid " />
      </Modal.Body>
    </Modal>
  );
}

export default FullscreenImageModal;
