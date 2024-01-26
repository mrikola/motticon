import { useContext, useEffect, useState } from "react";
import { Match, Round } from "../../types/Tournament";
import dayjs, { Dayjs } from "dayjs";
import ResultsInputModal, { ModalProps } from "../general/ResultsInputModal";
import { Player } from "../../types/User";
import { get, post, put } from "../../services/ApiService";
import { UserInfoContext } from "../provider/UserInfoProvider";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";
import CardCountdownTimer from "../general/CardCountdownTimer";
import MatchesRemainingProgressBar from "../general/MatchesRemainingProgressBar";
import MatchTable from "./MatchTable";
import { useParams } from "react-router";
import VerticallyCenteredModal, {
  VerticallyCenteredModalProps,
} from "../general/VerticallyCenteredModal";

type Props = {
  currentRound: Round;
};

const ManageRound = ({ currentRound }: Props) => {
  const user = useContext(UserInfoContext);
  const { tournamentId } = useParams();
  const [timeRemaining, setTimeRemaining] = useState<number>();
  const [matches, setMatches] = useState<Match[]>();
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [roundStart, setRoundStart] = useState<Dayjs>();
  const [modal, setModal] = useState<ModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    actionFunction: () => {},
    match: {
      id: 1,
      tableNumber: 1,
      player1GamesWon: 0,
      player2GamesWon: 0,
      player1: {} as Player,
      player2: {} as Player,
      resultSubmittedBy: {} as Player,
    },
  });
  const [endRoundModal, setEndRoundModal] =
    useState<VerticallyCenteredModalProps>({
      show: false,
      onHide: () => null,
      heading: "",
      text: "",
      actionText: "",
      actionFunction: () => {},
    });

  useEffect(() => {
    if (currentRound) {
      setRoundStart(dayjs(currentRound?.startTime));
    }
  }, [currentRound]);

  useEffect(() => {
    const now = dayjs();
    const endTime = roundStart?.add(50, "m");
    const diff = endTime?.diff(now, "second");
    setTimeRemaining(diff);
  }, [roundStart, timeRemaining]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/match/round/${currentRound?.id}`);
      const mtchs = (await response.json()) as Match[];
      // sort by table number, descending
      mtchs.sort((a, b) => (a.tableNumber > b.tableNumber ? 1 : -1));
      setMatches(mtchs);
      console.log(mtchs);
    };
    if (currentRound) {
      fetchData();
    }
  }, [currentRound]);

  useEffect(() => {
    if (matches) {
      setTotalMatches(matches.length);
    }
  }, [matches]);

  const [resultsMissing, setResultsMissing] = useState<number>(0);

  useEffect(() => {
    if (matches) {
      setResultsMissing(
        matches.filter((match) => match.resultSubmittedBy == null).length
      );
    }
  }, [matches]);

  function submitResult(
    match: Match,
    player1GamesWon: string,
    player2GamesWon: string
  ) {
    const matchId = match.id;
    const resultSubmittedBy = user?.id;
    const roundId = currentRound?.id;
    post(`/staff/submitResult`, {
      roundId,
      matchId,
      resultSubmittedBy,
      player1GamesWon,
      player2GamesWon,
    }).then(async (resp) => {
      const jwt = await resp.json();
      if (jwt !== null) {
        console.log(jwt);
        setMatches(jwt);
        setModal({
          ...modal,
          show: false,
        });
      }
    });
  }

  function submitResultClicked(clickedMatch: Match) {
    setModal({
      show: true,
      onHide: () => null,
      heading: "Submit result",
      actionFunction: submitResult,
      match: clickedMatch,
    });
  }

  const endRound = async () => {
    const response = await put(
      `/tournament/${tournamentId}/round/${currentRound.id}/end`,
      {}
    );
    // this works but the json response is null due to no round=started
    const round = (await response.json()) as Round;

    console.log(round);
    // do some actual stuff here
  };

  function handleEndRoundClick() {
    setEndRoundModal({
      show: true,
      onHide: () => null,
      heading: "Confirm round end",
      text: "Are you sure you want to end this round?",
      actionText: "Confirm round end",
      actionFunction: endRound,
    });
  }

  if (user && currentRound && timeRemaining && matches) {
    return (
      <>
        <Row>
          <Container>
            <Card className="horizontal-card mb-3">
              <Row className="align-items-center">
                <Col xs={4} sm={3}>
                  <span className="icon-stack">
                    <SquareFill className="icon-stack-3x" />
                    <p className="icon-stack-2x text-light">
                      {currentRound?.roundNumber}
                    </p>
                  </span>
                </Col>
                <Col xs={8} sm={9}>
                  <Card.Body className="horizontal-card-body">
                    <Card.Title className="horizontal-card-title-small align-middle">
                      Round number
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <CardCountdownTimer initialSeconds={timeRemaining} />
            <Col xs={12}>
              <MatchesRemainingProgressBar
                remainingMatches={resultsMissing}
                totalMatches={totalMatches}
              />
            </Col>
          </Container>
        </Row>
        <Row>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto my-3">
            <Button
              variant="primary"
              className="btn-lg"
              disabled={resultsMissing > 0}
              aria-disabled={resultsMissing > 0}
              onClick={() => handleEndRoundClick()}
            >
              End round
            </Button>
          </Col>
        </Row>
        <MatchTable
          matches={matches}
          submitResultClicked={submitResultClicked}
        />
        <VerticallyCenteredModal
          show={endRoundModal.show}
          onHide={() =>
            setEndRoundModal({
              ...endRoundModal,
              show: false,
            })
          }
          heading={endRoundModal.heading}
          text={endRoundModal.text}
          actionText={endRoundModal.actionText}
          actionFunction={endRoundModal.actionFunction}
        />
        <ResultsInputModal
          show={modal.show}
          onHide={() =>
            setModal({
              ...modal,
              show: false,
            })
          }
          heading={modal.heading}
          actionFunction={modal.actionFunction}
          match={modal.match}
        />
      </>
    );
  }
};

export default ManageRound;
