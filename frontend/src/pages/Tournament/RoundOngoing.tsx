import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
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
import { SquareFill, Stopwatch, BoxArrowInLeft } from "react-bootstrap-icons";

function RoundOngoing() {
  const user = useContext(UserInfoContext);
  const [playerRadioValue, setPlayerRadioValue] = useState("0");
  const [opponentRadioValue, setOpponentRadioValue] = useState("0");

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

  const [timerStyle, setTimerStyle] = useState("display-5");
  const [time, setTime] = useState(3);

  function timeRunOut() {
    setTimerStyle("display-5 text-danger");
  }

  useEffect(() => {
    let timer = setInterval(() => {
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

  if (user) {
    return (
      <Container className="mt-3 my-md-4">
        <Row>
          <h1 className="display-1">Round: 5</h1>
          <Col xs={12} className="align-items-center">
            <p className={timerStyle}>
              <Stopwatch />
              {`${Math.floor(time / 60)}`.padStart(2, "0")}:
              {`${time % 60}`.padStart(2, "0")} remaining
            </p>
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
                    <p className="icon-stack-2x text-light">7</p>
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
            <h2>Their Name</h2>
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
            <Button variant="primary">Submit result</Button>
          </div>
        </Row>
      </Container>
    );
  }
}

export default RoundOngoing;
