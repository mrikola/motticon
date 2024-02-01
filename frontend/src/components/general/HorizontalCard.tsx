import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";

type Props = {
  squareFillContent: string;
  cardTitle: string;
};

function HorizontalCard({ squareFillContent, cardTitle }: Props) {
  const [textSize, setTextSize] = useState<string>();

  useEffect(() => {
    if (cardTitle.length > 10) {
      setTextSize("small");
    } else {
      setTextSize("large");
    }
  }, [cardTitle]);

  return (
    <Card className="horizontal-card mb-3">
      <Row className="align-items-center">
        <Col xs={4} sm={3} md={2}>
          <span className="icon-stack">
            <SquareFill className="icon-stack-3x" />
            <p className="icon-stack-2x text-light">{squareFillContent}</p>
          </span>
        </Col>
        <Col xs={8} sm={9} md={10}>
          <Card.Body className="horizontal-card-body">
            <Card.Title
              className={
                textSize === "small"
                  ? "horizontal-card-title-small align-middle"
                  : "horizontal-card-title align-middle"
              }
            >
              {cardTitle}
            </Card.Title>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default HorizontalCard;
