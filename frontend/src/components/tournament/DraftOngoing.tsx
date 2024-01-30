import { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Box, SquareFill } from "react-bootstrap-icons";
import {
  Draft,
  DraftPod,
  DraftPodSeat,
  Tournament,
} from "../../types/Tournament";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../provider/UserInfoProvider";
import { Helmet, HelmetProvider } from "react-helmet-async";
import DeckBuildingSubmission from "./DeckBuildingSubmission";

type Props = {
  tournament: Tournament;
  draft: Draft;
};

function DraftOngoing({ tournament, draft }: Props) {
  const user = useContext(UserInfoContext);
  const [playerPod, setPlayerPod] = useState<DraftPod>();
  const [playerSeat, setPlayerSeat] = useState<DraftPodSeat>();
  const [deckBuildingDone, setDeckBuildingDone] = useState<boolean>(false);

  // get relevant draft info
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/draft/${draft.id}/user/${user?.id}`);
      const draftPod = (await response.json()) as DraftPod;

      setPlayerPod(draftPod);
      setPlayerSeat(draftPod.seats[0]);
      draftPod.seats[0].deckPhotoUrl ? setDeckBuildingDone(true) : false;
    };
    if (user && draft) {
      fetchData();
    }
  }, [user, draft]);

  function doneSetter(value: boolean) {
    setDeckBuildingDone(value);
  }

  if (user && draft && playerPod && playerSeat) {
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
          <h2 className="display-2">Draft: {draft.draftNumber}</h2>
        </Row>
        <Row>
          <Container>
            <Card className="horizontal-card mb-3">
              <Row className="align-items-center">
                <Col xs={3}>
                  <span className="icon-stack">
                    <SquareFill className="icon-stack-3x" />
                    <Box className="icon-stack-2x text-light" />
                  </span>
                </Col>
                <Col xs={9}>
                  <Card.Body className="horizontal-card-body">
                    <Card.Title className="horizontal-card-title-small align-middle">
                      {playerPod.cube.title}
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <Card className="horizontal-card mb-3">
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
                  <Card.Body className="horizontal-card-body">
                    <Card.Title className="horizontal-card-title">
                      Pod
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <Card className="horizontal-card mb-3">
              <Row>
                <Col xs={3}>
                  <span className="icon-stack">
                    <SquareFill className="icon-stack-3x" />
                    <p className="icon-stack-2x text-light">
                      {playerSeat?.seat}
                    </p>
                  </span>
                </Col>
                <Col xs={9}>
                  <Card.Body className="horizontal-card-body">
                    <Card.Title className="horizontal-card-title">
                      Seat
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Container>
        </Row>

        <DeckBuildingSubmission
          seat={playerSeat}
          tournamentId={tournament.id}
          done={deckBuildingDone}
          setDone={doneSetter}
        />
      </Container>
    );
  }
}

export default DraftOngoing;
