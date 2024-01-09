import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { get } from "../../services/ApiService";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
  ProgressBar,
} from "react-bootstrap";
import { SquareFill, BoxArrowInLeft } from "react-bootstrap-icons";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";

function StaffView() {
  const user = useContext(UserInfoContext);
  const { tournamentId } = useParams();
  const [staff, setStaff] = useState<boolean>(false);

  // check if user is staff
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/user/${user?.id}/staff`);
      const staffed = await response.json();
      staffed.map((tournament) => {
        if (tournament.id == tournamentId) {
          setStaff(true);
        }
      });
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const totalMatches = 64;
  const [players, setPlayers] = useState<Player>([]);

  useState(() => {
    for (let n = 1; n <= 32; n++) {
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
  });

  const [resultsMissing, setResultsMissing] = useState(
    players.filter((player) => player.submitted == false).length
  );
  const percentage = (resultsMissing / totalMatches) * 100;
  const [timerStyle, setTimerStyle] = useState("icon-stack-1x text-light");
  const [time, setTime] = useState(3000);

  function timeRunOut() {
    setTimerStyle("icon-stack-1x text-light");
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((time) => {
        if (time === 0) {
          clearInterval(timer);
          timeRunOut();
          return 0;
        } else return time - 1;
      });
    }, 1000);
    return function stopTimer() {
      clearInterval(timer);
    };
  }, []);

  if (staff) {
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
          <h1 className="display-1">Hey Staffer {staff}</h1>
        </Row>
        <Row>
          <Container>
            <Card className="round-card mb-3">
              <Row className="align-items-center">
                <Col xs={3}>
                  <span className="icon-stack">
                    <SquareFill className="icon-stack-3x" />
                    <p className="icon-stack-2x text-light">4</p>
                  </span>
                </Col>
                <Col xs={9}>
                  <Card.Body className="round-card-body">
                    <Card.Title className="round-card-title-small align-middle">
                      Round number
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <Card className="round-card mb-3">
              <Row className="align-items-center">
                <Col xs={6}>
                  <span className="icon-stack">
                    <SquareFill className="icon-stack-3x" />

                    <p className={timerStyle}>
                      {`${Math.floor(time / 60)}`.padStart(2, "0")}:
                      {`${time % 60}`.padStart(2, "0")}
                    </p>
                  </span>
                </Col>
                <Col xs={6}>
                  <Card.Body className="round-card-body">
                    <Card.Title className="round-card-title-small">
                      Time left
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
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
  } else {
    return (
      <Container className="mt-3 my-md-4">
        <Row>
          <h1 className="display-1">You are not staff, sorry</h1>
        </Row>
      </Container>
    );
  }
}

export default StaffView;
