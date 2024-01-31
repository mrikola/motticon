import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import DeckImage from "/img/draft_pool.png";
import { Cube } from "../../types/Cube";
import { get } from "../../services/ApiService";
import {
  Image,
  PenFill,
  BoxArrowInLeft,
  BoxArrowUpRight,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import HelmetTitle from "../../components/general/HelmetTitle";

const ViewCube = () => {
  const { cubeId, tournamentId } = useParams();
  const [cube, setCube] = useState<Cube>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/cube/${cubeId}`);
      const cube = (await resp.json()) as Cube;
      setCube(cube);
    };

    fetchData();
  }, []);

  const [show, setShow] = useState(false);

  const drafts = [];
  for (let d = 1; d <= 3; d++) {
    const playerList = [];
    for (let p = 1; p <= 8; p++) {
      playerList.push({
        id: p,
      });
    }
    drafts.push({
      id: d,
      players: playerList,
    });
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalDraftNumber, setModalDraftNumber] = useState(0);
  const [modalPlayerName, setModalPlayerName] = useState("filler name");

  function setModalContent(draftNumber: number, playerName: string) {
    setModalDraftNumber(draftNumber);
    setModalPlayerName(playerName);
    handleShow();
  }

  if (cube) {
    return (
      <>
        <HelmetTitle titleText={cube.title} />

        <div
          className="cube-masthead text-light mb-3"
          style={{ backgroundImage: `url(${cube.imageUrl})` }}
        >
          <div
            className="mask"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          >
            <Container className="h-100">
              <Row className="mt-3 my-md-4">
                <Col>
                  <Link
                    to={`/tournament/${tournamentId}/cubes/`}
                    className="btn btn-primary"
                  >
                    <BoxArrowInLeft /> Back to tournament cubes
                  </Link>
                </Col>
              </Row>
              <Row className="h-100 align-items-center">
                <Col className="text-center">
                  <h1 className="display-1">{cube.title}</h1>
                  <p className="small icon-link">
                    <PenFill /> Cube Designer: {cube.owner}
                  </p>
                  <p className="lead">{cube.description}</p>
                  <div className="d-grid gap-2">
                    <Link
                      to={cube.url}
                      target="_blank"
                      className="btn btn-primary"
                    >
                      <BoxArrowUpRight className="fs-4" /> View list
                    </Link>
                  </div>
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
                      onClick={() =>
                        setModalContent(draft.id, "Player " + player.id)
                      }
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
            <Modal.Title>
              {cube.title} – Draft {modalDraftNumber} – {modalPlayerName}
            </Modal.Title>
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
