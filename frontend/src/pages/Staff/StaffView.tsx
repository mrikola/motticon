import { useContext, useState, useEffect } from "react";
import { Card, Col, Container, Row, Table, ProgressBar } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";
import CardCountdownTimer from "../../components/general/CardCountdownTimer";
import dayjs, { Dayjs } from "dayjs";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import { UserInfoContext } from "../../components/provider/UserInfoProvider";

function StaffView() {
  const [timeRemaining, setTimeRemaining] = useState<number>();
  const user = useContext(UserInfoContext);
  // const [roundStart, setRoundStart] = useState<Dayjs>(dayjs(round.startTime));
  const [roundStart, setRoundStart] = useState<Dayjs>(dayjs());
  const totalMatches = 64;

  const [players, setPlayers] = useState([]);

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

  const [resultsMissing, setResultsMissing] = useState(
    players.filter((player) => player.submitted == false).length
  );
  const percentage = (resultsMissing / totalMatches) * 100;

  useEffect(() => {
    const now = dayjs();
    const endTime = roundStart.add(50, "m");
    const diff = endTime.diff(now, "second");
    setTimeRemaining(diff);
  }, [user, roundStart, timeRemaining]);

  if (user) {
    return (
      <Container className="mt-3 my-md-4">
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
                    <p className="icon-stack-2x text-light">4</p>
                  </span>
                </Col>
                <Col xs={8} sm={9}>
                  <Card.Body className="round-card-body">
                    <Card.Title className="round-card-title-small align-middle">
                      Round TEST number
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <CardCountdownTimer initialSeconds={timeRemaining} />

            <Col xs={12}>
              <ProgressBar striped variant="primary" now={100 - percentage} />
              <p className="lead">
                {resultsMissing}/{totalMatches} matches remaining
              </p>
            </Col>
          </Container>
        </Row>
        <Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Table</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Result Submitted</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index} className={player.id === 5 ? "table-info" : ""}>
                  <td>{player.table}</td>
                  <td>{player.firstName}</td>
                  <td>{player.lastName}</td>
                  <td>{player.submitted === true ? "yes" : "no"}</td>
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
