import { Card, Col, Row } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";

type Props = {
  squareFillContent: string;
  cardTitle: string;
};

function HorizontalCard({ squareFillContent, cardTitle }: Props) {
  return (
    <Card className="horizontal-card mb-3">
      <Row>
        <Col xs={3}>
          <span className="icon-stack">
            <SquareFill className="icon-stack-3x" />
            <p className="icon-stack-2x text-light">{squareFillContent}</p>
          </span>
        </Col>
        <Col xs={9}>
          <Card.Body className="horizontal-card-body">
            <Card.Title className="horizontal-card-title">
              {cardTitle}
            </Card.Title>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default HorizontalCard;
