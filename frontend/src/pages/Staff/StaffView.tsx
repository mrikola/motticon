import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { get } from "../../services/ApiService";
import {
  Card,
  Col,
  Container,
  Row,
  Table,
  ProgressBar,
  Button,
} from "react-bootstrap";
import { BoxArrowInLeft, SquareFill } from "react-bootstrap-icons";
import CardCountdownTimer from "../../components/general/CardCountdownTimer";
import dayjs, { Dayjs } from "dayjs";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Match, Round } from "../../types/Tournament";

function StaffView() {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [currentRound, setCurrentRound] = useState<Round>();
  const [timeRemaining, setTimeRemaining] = useState<number>();
  const [matches, setMatches] = useState<Match[]>();
  const [totalMatches, setTotalMatches] = useState<number>(0);

  const [players, setPlayers] = useState<any>([]);

  // dummy data setup
  useEffect(() => {
    for (let n = 1; n <= 16; n++) {
      players.push({
        table: n,
        firstName: "Timo",
        lastName: "Tuuttari",
        submitted: false,
      });
      players.push({
        table: n,
        firstName: "Jaska",
        lastName: "Jokunen",
        submitted: true,
      });
    }
    players.sort((a, b) => (a.table > b.table ? 1 : -1));
  }, []);

  const [roundStart, setRoundStart] = useState<Dayjs>();

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
      // note: change static round number 4 back to ${currentRound?.roundNumber}
      const response = await get(`/match/round/${currentRound?.id}`);
      const mtchs = await response.json();
      setMatches(mtchs);
    };
    if (currentRound) {
      fetchData();
    }
  }, [currentRound]);

  useEffect(() => {
    setTotalMatches(matches?.length);
  }, [matches]);

  const [resultsMissing, setResultsMissing] = useState<number>(0);

  useEffect(() => {
    if (matches) {
      setResultsMissing(
        matches.filter((match) => match.player1GamesWon == 0).length
      );
    }
  }, [matches]);

  const [percentage, setPercentage] = useState<number>(
    (resultsMissing / totalMatches) * 100
  );

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
              <ProgressBar striped variant="primary" now={100 - percentage} />
              <p className="lead">
                {resultsMissing}/{totalMatches} matches left
              </p>
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
                    <Button variant="primary" type="submit">
                      Submit result
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}

export default StaffView;
