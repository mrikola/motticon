import { useState, useContext, useEffect } from "react";
import { UserInfoContext } from "../provider/UserInfoProvider";
import { post } from "../../services/ApiService";
import { get } from "../../services/ApiService";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";
import dayjs, { Dayjs } from "dayjs";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import CountdownTimer from "../general/CountdownTimer";
import MatchesRemainingProgressBar from "../general/MatchesRemainingProgressBar";
import MatchResultRadioButtons from "../general/MatchResultRadioButtons";
import { Match, Round } from "../../types/Tournament";
import VerticallyCenteredModal, {
  ModalProps,
} from "../general/VerticallyCenteredModal";

type Props = {
  round: Round;
  match: Match;
};

function RoundOngoing({ round, match }: Props) {
  console.log(match);
  // todo: set corrent opponent name
  const [timeRemaining, setTimeRemaining] = useState<number>();
  const user = useContext(UserInfoContext);
  const [roundStart, setRoundStart] = useState<Dayjs>(dayjs(round.startTime));
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [matches, setMatches] = useState<Match[]>();
  const [playerRadioValue, setPlayerRadioValue] = useState<string>(
    match.player1GamesWon.toString()
  );
  const [opponentRadioValue, setOpponentRadioValue] = useState<string>(
    match.player2GamesWon.toString()
  );
  const [modal, setModal] = useState<ModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
  });
  const [opponent, setOpponent] = useState({
    firstName: "Opponent",
    lastName: "Lastname",
  });

  // handle result submission
  const submitResult = () => {
    const matchId = match.id;
    const resultSubmittedBy = user?.id;
    const player1GamesWon = playerRadioValue;
    const player2GamesWon = opponentRadioValue;
    post(`/submitResult`, {
      matchId,
      resultSubmittedBy,
      player1GamesWon,
      player2GamesWon,
    }).then(async (resp) => {
      const jwt = await resp.text();
      if (jwt !== null) {
        console.log(jwt);
        setModal({
          ...modal,
          show: false,
        });
        // todo: do stuff here
      }
    });
  };

  // set modal information when user clicks "submit"
  function handleSubmitClicked() {
    setModal({
      show: true,
      onHide: () => null,
      heading: "Confirm result",
      text: "You submitted:",
      text2:
        user?.firstName +
        " " +
        user?.lastName +
        " " +
        playerRadioValue +
        " – " +
        opponentRadioValue +
        " " +
        opponent.firstName +
        " " +
        opponent.lastName,
      text3: "Is this correct?",
      actionText: "Confirm result",
      actionFunction: submitResult,
    });
  }

  // timer
  useEffect(() => {
    const now = dayjs();
    const endTime = roundStart.add(50, "m");
    const diff = endTime.diff(now, "second");
    setTimeRemaining(diff);
  }, [user, roundStart, timeRemaining]);

  // get all matches for round (for progress bar)
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/match/round/${round.id}`);
      const mtchs = await response.json();
      setMatches(mtchs);
    };
    if (round) {
      fetchData();
    }
  }, [round]);

  // set total matches for progress bar
  useEffect(() => {
    if (matches) {
      setTotalMatches(matches.length);
    }
  }, [matches]);

  const [resultsMissing, setResultsMissing] = useState<number>(0);

  // ongoing matches for progress bar
  useEffect(() => {
    if (matches) {
      // player1GamesWon as placeholder, need some type of "resultReported" boolean in the future
      setResultsMissing(
        matches.filter((match) => match.player1GamesWon == 0).length
      );
    }
  }, [matches]);

  if (user && timeRemaining) {
    return (
      <Container className="mt-3 my-md-4">
        <Row>
          <h1 className="display-1">Round: {round.roundNumber}</h1>
          <h2>Started: {dayjs(roundStart).format("HH:mm")}</h2>
          <Col xs={12}>
            <CountdownTimer initialSeconds={timeRemaining} />
          </Col>
          <Col xs={12}>
            <MatchesRemainingProgressBar
              remainingMatches={resultsMissing}
              totalMatches={totalMatches}
            />
          </Col>
        </Row>
        <Row>
          <Container>
            <Card className="round-card mb-3">
              <Row>
                <Col xs={3}>
                  <span className="icon-stack">
                    <SquareFill className="icon-stack-3x" />
                    <p className="icon-stack-2x text-light">
                      {match.tableNumber}
                    </p>
                  </span>
                </Col>
                <Col xs={9}>
                  <Card.Body className="round-card-body">
                    <Card.Title className="round-card-title">Table</Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Container>
        </Row>
        <Row>
          <MatchResultRadioButtons
            name={"player-radio"}
            value={playerRadioValue}
            updateFunction={setPlayerRadioValue}
            disabled={match.resultSubmittedBy ? true : false}
          />
          <Col xs={12} className="text-center">
            <h2>
              {user.firstName} {user.lastName}
            </h2>
          </Col>
          <Col xs={12} className="text-center">
            <h2>vs.</h2>
          </Col>
          <Col xs={12} className="text-center">
            <h2>
              {opponent.firstName} {opponent.lastName}
            </h2>
          </Col>
          <MatchResultRadioButtons
            name={"opponent-radio"}
            value={opponentRadioValue}
            updateFunction={setOpponentRadioValue}
            disabled={match.resultSubmittedBy ? true : false}
          />
          <div className="d-grid gap-2 my-3">
            <Button
              variant="primary"
              className="btn-lg"
              type="submit"
              disabled={match.resultSubmittedBy ? true : false}
              aria-disabled={match.resultSubmittedBy ? true : false}
              onClick={() => handleSubmitClicked()}
            >
              {match.resultSubmittedBy ? "Result submitted" : "Submit result"}
            </Button>
          </div>
          <VerticallyCenteredModal
            show={modal.show}
            onHide={() =>
              setModal({
                ...modal,
                show: false,
              })
            }
            heading={modal.heading}
            text={modal.text}
            text2={modal.text2}
            text3={modal.text3}
            actionText={modal.actionText}
            actionFunction={modal.actionFunction}
          />
        </Row>
      </Container>
    );
  }
}

export default RoundOngoing;
