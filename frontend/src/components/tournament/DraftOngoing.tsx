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
import DecksSubmittedProgressBar from "../staff/DecksSubmittedProgressBar";
import HorizontalCard from "../general/HorizontalCard";

type Props = {
  tournament: Tournament;
  draft: Draft;
};

function DraftOngoing({ tournament, draft }: Props) {
  const user = useContext(UserInfoContext);
  const [playerPod, setPlayerPod] = useState<DraftPod>();
  const [playerSeat, setPlayerSeat] = useState<DraftPodSeat>();
  const [deckBuildingDone, setDeckBuildingDone] = useState<boolean>(false);
  const [buildingRemaining, setBuildingRemaining] = useState<number>(0);
  const [allSeats, setAllSeats] = useState<DraftPodSeat[]>([]);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);

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

  // get other seats for progress bar
  useEffect(() => {
    const seats: DraftPodSeat[] = [];
    for (let i = 0; i < draft.pods.length; i++) {
      const pod = draft.pods[i];
      for (let j = 0; j < pod.seats.length; j++) {
        const seat = pod.seats[j];
        seats.push({ ...seat, pod });
      }
    }
    setAllSeats(seats);
    if (totalPlayers === 0) {
      setTotalPlayers(seats.length);
    }
  }, [draft]);

  // update progress bar based on number of players done building
  useEffect(() => {
    if (allSeats) {
      setBuildingRemaining(
        allSeats.filter((seat) => seat.deckPhotoUrl == null).length
      );
    }
  }, [allSeats]);

  // callback function for modal once player confirms submit
  function doneSetter(value: boolean) {
    setDeckBuildingDone(value);
  }

  if (user && draft && playerPod && playerSeat) {
    return (
      <>
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
            <HorizontalCard
              squareFillContent={playerPod.podNumber.toString()}
              cardTitle="Pod"
            />
            <HorizontalCard
              squareFillContent={playerSeat?.seat.toString()}
              cardTitle="Seat"
            />
          </Container>
        </Row>
        <DecksSubmittedProgressBar
          remainingSubmissions={buildingRemaining}
          totalPlayers={totalPlayers}
        />
        <DeckBuildingSubmission
          seat={playerSeat}
          tournamentId={tournament.id}
          done={deckBuildingDone}
          setDone={doneSetter}
        />
      </>
    );
  }
}

export default DraftOngoing;
