import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import { Box, Image, SquareFill } from "react-bootstrap-icons";
import {
  Draft,
  DraftPod,
  DraftPodSeat,
  Tournament,
} from "../../types/Tournament";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../provider/UserInfoProvider";
import { Helmet, HelmetProvider } from "react-helmet-async";

type Props = {
  tournament: Tournament;
  draft: Draft;
};

function DraftOngoing({ tournament, draft }: Props) {
  const user = useContext(UserInfoContext);
  const [playerPod, setPlayerPod] = useState<DraftPod>();
  const [playerSeat, setPlayerSeats] = useState<number>();

  // get pods
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/draft/pods/2`);
      const draftPods = (await response.json()) as DraftPod[];
      draftPods.forEach((pod) => {
        // todo:
        if (pod.id === 1) {
          setPlayerPod(pod);
        }
      });
    };
    if (draft) {
      fetchData();
    }
  }, [draft]);

  // get seats for pod
  useEffect(() => {
    const fetchData = async () => {
      const id = playerPod.id;
      const response = await get(`/draft/seats/${id}`);
      const draftSeats = (await response.json()) as DraftPodSeat[];
      draftSeats.forEach((seat) => {
        if (seat.id === user?.id) {
          setPlayerSeats(seat.seat);
        }
      });
    };
    if (playerPod) {
      fetchData();
    }
  }, [playerPod, user]);

  if (user && draft && playerPod) {
    return (
      <Container className="mt-3 my-md-4">
        <HelmetProvider>
          <Helmet>
            <title>
              MottiCon &#9632; {tournament.name} Draft{" "}
              {draft.draftNumber.toString()}
            </title>
          </Helmet>
        </HelmetProvider>
        <Row>
          <h1 className="display-1">{tournament.name}</h1>
          <h2 className="display-2">Draft: {draft.draftNumber}</h2>
        </Row>
        <Row>
          <Container>
            <Card className="round-card mb-3">
              <Row className="align-items-center">
                <Col xs={3}>
                  <span className="icon-stack">
                    <SquareFill className="icon-stack-3x" />
                    <Box className="icon-stack-2x text-light" />
                  </span>
                </Col>
                <Col xs={9}>
                  <Card.Body className="round-card-body">
                    <Card.Title className="round-card-title-small align-middle">
                      {playerPod.cube.title}
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <Card className="round-card mb-3">
              <Row>
                <Col xs={3}>
                  <span className="icon-stack">
                    <SquareFill className="icon-stack-3x" />
                    <p className="icon-stack-2x text-light">
                      {playerPod.podNumber}
                    </p>
                  </span>
                </Col>
                <Col xs={9}>
                  <Card.Body className="round-card-body">
                    <Card.Title className="round-card-title">Pod</Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <Card className="round-card mb-3">
              <Row>
                <Col xs={3}>
                  <span className="icon-stack">
                    <SquareFill className="icon-stack-3x" />
                    <p className="icon-stack-2x text-light">{playerSeat}</p>
                  </span>
                </Col>
                <Col xs={9}>
                  <Card.Body className="round-card-body">
                    <Card.Title className="round-card-title">Seat</Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Container>
        </Row>
        <Row>
          <h2>Draft pool submission</h2>
          <p>
            After the draft, please submit a photo showing all the cards you
            have drafted.
          </p>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Draft pool photo</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" className="btn-lg">
              <Image /> Submit pool photo
            </Button>
          </div>
        </Row>
      </Container>
    );
  }
}

export default DraftOngoing;
