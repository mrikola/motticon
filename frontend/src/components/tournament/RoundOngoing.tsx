import { useState, useContext, useEffect } from "react";
import { UserInfoContext } from "../provider/UserInfoProvider";
import { post } from "../../services/ApiService";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  ButtonGroup,
  ToggleButton,
  ProgressBar,
} from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";
import dayjs, { Dayjs } from "dayjs";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import CountdownTimer from "../general/CountdownTimer";
import { Match, Round } from "../../types/Tournament";
import VerticallyCenteredModal, {
  ModalProps,
} from "../general/VerticallyCenteredModal";

type Props = {
  round: Round;
  match: Match;
};

function RoundOngoing({ round, match }: Props) {
  const [timeRemaining, setTimeRemaining] = useState<number>();
  const user = useContext(UserInfoContext);
  const [playerRadioValue, setPlayerRadioValue] = useState(
    match.player1GamesWon.toString()
  );
  const [opponentRadioValue, setOpponentRadioValue] = useState(
    match.player2GamesWon.toString()
  );
  const [roundStart, setRoundStart] = useState<Dayjs>(dayjs(round.startTime));

  // placeholder stuff to have something to show in the view
  const totalMatches = 64;
  const [ongoingMatches, setOngoingMatches] = useState(
    Math.floor(Math.random() * totalMatches) + 1
  );
  const percentage = (ongoingMatches / totalMatches) * 100;
  const radios = [
    { name: "0", value: "0" },
    { name: "1", value: "1" },
    { name: "2", value: "2" },
  ];
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
        // todo: do stuff here
      }
    });
  };

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

  useEffect(() => {
    const now = dayjs();
    const endTime = roundStart.add(50, "m");
    const diff = endTime.diff(now, "second");
    setTimeRemaining(diff);
  }, [user, roundStart, timeRemaining]);

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
            <ProgressBar striped variant="primary" now={100 - percentage} />
            <p className="lead">
              {ongoingMatches}/{totalMatches} matches remaining
            </p>
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
          <ButtonGroup className="round-radio-group">
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                size="lg"
                id={`player-radio-${idx}`}
                type="radio"
                variant="round-radio"
                name="player-radio"
                value={radio.value}
                checked={playerRadioValue === radio.value}
                className="round-radio"
                onChange={(e) => setPlayerRadioValue(e.currentTarget.value)}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
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
          <ButtonGroup className="round-radio-group">
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                size="lg"
                id={`opponent-radio-${idx}`}
                type="radio"
                variant="round-radio"
                name="opponent-radio"
                value={radio.value}
                checked={opponentRadioValue === radio.value}
                className="round-radio"
                onChange={(e) => setOpponentRadioValue(e.currentTarget.value)}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          <div className="d-grid gap-2 my-3">
            <Button
              variant="primary"
              type="submit"
              onClick={() => handleSubmitClicked()}
            >
              Submit result
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
