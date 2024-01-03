import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DeckImage from '/img/draft_pool.png';

function Test() {
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal 
        show={show} 
        onHide={handleClose}
        fullscreen={fullscreen}
        >
        
        <Modal.Header closeButton>
          <Modal.Title>Cube Name – Draft Number – Player Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={DeckImage} className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Test;