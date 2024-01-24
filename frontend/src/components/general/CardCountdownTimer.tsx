import { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";

type Props = {
  initialSeconds: number;
};

function CardCountdownTimer({ initialSeconds }: Props) {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [timerStyle, setTimerStyle] = useState("icon-stack-1x text-light");
  const [cardText, setCardText] = useState<string>("Time remaining");

  useEffect(() => {
    if (seconds <= 0) {
      timeRunOut();
      // Stop timer if one hour over time
      if (seconds <= -3599) {
        setSeconds(-3599);
        return;
      }
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
    setTimerStyle("icon-stack-1x over-time");
    setCardText("Over time");
  }

  // Format the remaining time (e.g., “00:05:10” for 5 minutes and 10 seconds)
  function formatTime(timeInSeconds: number) {
    const absSeconds = Math.abs(timeInSeconds);
    const minutes = Math.floor(absSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (absSeconds % 60).toString().padStart(2, "0");
    return minutes + ":" + secs;
  }

  return (
    <Card className="horizontal-card mb-3">
      <Row className="align-items-center">
        <Col xs={4} sm={3}>
          <span className="icon-stack countdown-timer">
            <SquareFill className="icon-stack-3x" />
            <p className={timerStyle}>{formatTime(seconds)}</p>
          </span>
        </Col>
        <Col xs={8} sm={9}>
          <Card.Body className="horizontal-card-body">
            <Card.Title className="horizontal-card-title-small">
              {cardText}
            </Card.Title>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default CardCountdownTimer;
