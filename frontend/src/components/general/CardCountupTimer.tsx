import { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";

type Props = {
  started: boolean;
};

function CardCountupTimer({ started }: Props) {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (started) {
      // Set up the timer
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      // Clean up the timer
      return () => clearInterval(timer);
    }
  }, [seconds, started]);

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
            <p className="icon-stack-1x text-light">{formatTime(seconds)}</p>
          </span>
        </Col>
        <Col xs={8} sm={9}>
          <Card.Body className="horizontal-card-body">
            <Card.Title className="horizontal-card-title-small">
              Time elapsed
            </Card.Title>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default CardCountupTimer;
