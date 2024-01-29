import { useState, useContext, useEffect } from "react";
import { UserInfoContext } from "../provider/UserInfoProvider";
import { post } from "../../services/ApiService";
import { get } from "../../services/ApiService";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import CountdownTimer from "../general/CountdownTimer";
import MatchesRemainingProgressBar from "../general/MatchesRemainingProgressBar";
import MatchResultRadioButtons from "../general/MatchResultRadioButtons";
import { Match, Round, Tournament } from "../../types/Tournament";
import VerticallyCenteredModal, {
  VerticallyCenteredModalProps,
} from "../general/VerticallyCenteredModal";
import { Player } from "../../types/User";
import { Helmet, HelmetProvider } from "react-helmet-async";

type Props = {
  tournament: Tournament;
  round: Round;
  match: Match;
};

function RoundOngoing({ tournament, round, match }: Props) {
  const [timeRemaining, setTimeRemaining] = useState<number>();
  const user = useContext(UserInfoContext);
  const [roundStart, _setRoundStart] = useState<Dayjs>(dayjs(round.startTime));
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [matches, setMatches] = useState<Match[]>();
  const [playerRadioValue, setPlayerRadioValue] = useState<string>();
  const [opponentRadioValue, setOpponentRadioValue] = useState<string>();
  const [modal, setModal] = useState<VerticallyCenteredModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
  });
  const [player, setPlayer] = useState<Player>();
  const [opponent, setOpponent] = useState<Player>();
  //const [currentMatch, setCurrentMatch] = useState<Match>();

  // useEffect(() => {
  //   if (!currentMatch) {
  //     const fetchData = async () => {
  //       const response = await get(
  //         `/tournament/${tournament?.id}/round/${round?.id}/match/${user?.id}`
  //       );
  //       const match = (await response.json()) as Match;
  //       setCurrentMatch(match);
  //     };
  //     if (user && round) {
  //       fetchData();
  //     }
  //   }
  // }, [round]);

  useEffect(() => {
    // check player id's from match and set correct player & opponent objects
    if (match && user) {
      if (match.player1.id === user?.id) {
        setPlayer(match.player1);
        setPlayerRadioValue(match.player1GamesWon.toString());
        setOpponent(match.player2);
        setOpponentRadioValue(match.player2GamesWon.toString());
      } else {
        setPlayer(match.player2);
        setPlayerRadioValue(match.player2GamesWon.toString());
        setOpponent(match.player1);
        setOpponentRadioValue(match.player1GamesWon.toString());
      }
    }
  }, [match, user]);

  // handle result submission
  const submitResult = () => {
    const matchId = match.id;
    // const matchId = 3;
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
        opponent!.firstName +
        " " +
        opponent!.lastName,
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
      setResultsMissing(
        matches.filter((match) => match.resultSubmittedBy == null).length
      );
    }
  }, [matches]);

  if (user && timeRemaining && player && opponent) {
    return (
      <Container className="mt-3 my-md-4">
        <HelmetProvider>
          <Helmet>
            <title>
              MottiCon &#9632; {tournament.name} Round{" "}
              {round.roundNumber.toString()}
            </title>
          </Helmet>
        </HelmetProvider>
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
            <Card className="horizontal-card mb-3">
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
                  <Card.Body className="horizontal-card-body">
                    <Card.Title className="horizontal-card-title">
                      Table
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Container>
        </Row>
        <Row>
          <MatchResultRadioButtons
            name={"player-radio"}
            value={playerRadioValue ?? ""}
            updateFunction={setPlayerRadioValue}
            disabled={match.resultSubmittedBy ? true : false}
          />
          <Col xs={12} className="text-center">
            <h2>
              {player.firstName} {player.lastName}
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
            value={opponentRadioValue ?? ""}
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
