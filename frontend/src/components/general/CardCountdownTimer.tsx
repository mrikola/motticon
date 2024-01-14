import { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { SquareFill, Stopwatch } from "react-bootstrap-icons";

type Props = {
  initialSeconds: number;
};

function CardCountdownTimer({ initialSeconds }: Props) {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [timerStyle, setTimerStyle] = useState("display-3");

  useEffect(() => {
    // Exit early if countdown is finished
    if (seconds === 0) {
      timeRunOut();
    }

    // Set up the timer
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // Clean up the timer
    return () => clearInterval(timer);
  }, [seconds]);

  // Handle time running out
  function timeRunOut() {
    setTimerStyle("display-3 text-danger");
  }

  // Format the remaining time (e.g., “00:05:10” for 5 minutes and 10 seconds)
  function formatTime(timeInSeconds: number) {
    const absSeconds = Math.abs(timeInSeconds);
    const minutes = Math.floor(absSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (absSeconds % 60).toString().padStart(2, "0");
    return minutes + ":" + seconds;
  }

  return (
    <Card className="round-card mb-3">
      <Row className="align-items-center">
        <Col xs={4} sm={3}>
          <span className="icon-stack countdown-timer">
            <SquareFill className="icon-stack-3x" />
            <p className="icon-stack-1x text-light">
              {formatTime(seconds)} {seconds < 0 ? "over" : ""}
            </p>
          </span>
        </Col>
        <Col xs={8} sm={9}>
          <Card.Body className="round-card-body">
            <Card.Title className="round-card-title-small">
              Time left
            </Card.Title>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default CardCountdownTimer;
