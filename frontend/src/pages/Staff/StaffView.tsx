import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { get, post } from "../../services/ApiService";
import { Card, Col, Container, Row, Table, Button } from "react-bootstrap";
import { BoxArrowInLeft, SquareFill } from "react-bootstrap-icons";
import CardCountdownTimer from "../../components/general/CardCountdownTimer";
import dayjs, { Dayjs } from "dayjs";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import { Match, Round } from "../../types/Tournament";
import { useIsTournamentStaff } from "../../utils/auth";
import MatchesRemainingProgressBar from "../../components/general/MatchesRemainingProgressBar";
import ResultsInputModal, {
  ModalProps,
} from "../../components/general/ResultsInputModal";
import { Player } from "../../types/User";

function StaffView() {
  const { tournamentId } = useParams();
  const user = useIsTournamentStaff(Number(tournamentId));
  const [currentRound, setCurrentRound] = useState<Round>();
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/round`);
      const round = (await response.json()) as Round;
      const roundParsed: Round = {
        ...round,
        startTime: new Date(round.startTime),
      };
      setCurrentRound(roundParsed);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

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
  }, [user, roundStart, timeRemaining]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/match/round/${currentRound?.id}`);
      const mtchs = await response.json();
      // sort by table number, descending
      mtchs.sort((a, b) => (a.tableNumber > b.tableNumber ? 1 : -1));
      setMatches(mtchs);
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
    player1GamesWon: number,
    player2GamesWon: number
  ) {
    const matchId = match.id;
    const resultSubmittedBy = user?.id;
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

  if (user && currentRound && timeRemaining && matches) {
    return (
      <Container className="mt-3 my-md-4">
        <Col xs={12}>
          <Link to={`/tournament/${tournamentId}`}>
            <Button variant="primary">
              <BoxArrowInLeft /> Back to tournament
            </Button>
          </Link>
        </Col>
        <Row>
          <h1 className="display-1">
            Hey {user.firstName} {user.lastName}
          </h1>
        </Row>
        <Row>
          <Container>
            <Card className="round-card mb-3">
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
                  <Card.Body className="round-card-body">
                    <Card.Title className="round-card-title-small align-middle">
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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Table</th>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Result</th>
                <th>Staff result entry</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match, index) => (
                <tr key={index}>
                  <td>{match.tableNumber}</td>
                  <td>
                    {match.player1.firstName} {match.player1.lastName}
                  </td>
                  <td>
                    {match.player2.firstName} {match.player2.lastName}
                  </td>
                  <td>
                    {match.player1GamesWon} – {match.player2GamesWon}
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={() => submitResultClicked(match)}
                      disabled={match.resultSubmittedBy ? true : false}
                      aria-disabled={match.resultSubmittedBy ? true : false}
                    >
                      Submit result
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
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
      </Container>
    );
  }
}

export default StaffView;
