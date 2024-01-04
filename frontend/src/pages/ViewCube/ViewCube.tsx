import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import DeckImage from "/img/draft_pool.png";
import { Cube } from "../../types/Cube";
import { get } from "../../services/ApiService";
import { Image, List, PenFill } from "react-bootstrap-icons";

const ViewCube = () => {
  const { cubeId } = useParams();
  const ImageURL = `/img/masthead_${cubeId}.jpeg`;

  const [cube, setCube] = useState<Cube>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/cube/${cubeId}`);
      const cube = (await resp.json()) as Cube;
      // temporary fix: url field empty, set dummy url so link goes somewhere
      cube.url = "https://cubecobra.com/cube/overview/thebteam";
      setCube(cube);
    };

    fetchData();
  }, []);
  
  const [show, setShow] = useState(false);

  const drafts = [];
    for (let d= 1; d <= 3; d++) {
      const playerList = [];
      for (let p = 1; p <= 8; p++) {
        playerList.push({
              id: p
            });
      }
      drafts.push({
        id: d,
        players: playerList
      });
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // var modalDraftNumber = 'Dummy';
  var [modalDraftNumber, setModalDraftNumber] = useState('dummy number');
  var [modalPlayerName, setModalPlayerName] = useState('filler name');
  // var modalPlayerName = 'Filler Name';

  function setModalContent(draftNumber, playerName) {
    setModalDraftNumber(draftNumber);
    setModalPlayerName(playerName);
    handleShow();

  }

  if (cube) {
    return (
      <>
          <div
            className="cube-masthead text-light mb-3"
            style={{ backgroundImage: `url(${ImageURL})` }}
          >
            <div
              className="mask"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            >
              <Container className="h-100">
                <Row className="h-100 align-items-center">
                  <Col className="text-center">
                    <h1>{cube.title}</h1>
                    <p className="lead">
                      <PenFill /> Cube Designer: John Doe
                    </p>
                    <p>{cube.description}</p>
                    <a
                      href={cube.url}
                      target="_blank"
                      className="btn btn-primary"
                    >
                      <List /> View list on Cube Cobra
                    </a>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        <Container>
          <Row>
            {drafts.map((draft) => (
              <Col xs={12} sm={6} md={4} key={draft.id}>
                <h3>Draft {draft.id}</h3>
                  {draft.players.map((player) => (
                    <p key={player.id}>
                    <button
                      type="button"
                      className="btn btn-primary btn-player-pool-image"
                      onClick={()=>setModalContent(draft.id, 'Player ' + player.id)}
                    >
                      <Image />
                    </button>
                    Player Name {player.id}
                    </p>
                  ))}
              </Col>
            ))}
          </Row>
        </Container>

        <Modal show={show} onHide={handleClose} fullscreen={true}>
          <Modal.Header closeButton>
            <Modal.Title>{cube.title} – Draft {modalDraftNumber} – {modalPlayerName}</Modal.Title>
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
  } else {
    return <>Loading</>;
  }
};

export default ViewCube;
