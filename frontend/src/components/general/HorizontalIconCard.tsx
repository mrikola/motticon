import { Card, Col, Row } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";
import * as icons from "react-bootstrap-icons";
import { Icon } from "./Icon";

type Props = {
  iconName: keyof typeof icons;
  cardTitle: string;
  textSize: string;
};

function HorizontalIconCard({ iconName, cardTitle, textSize }: Props) {
  return (
    <Card className="horizontal-card mb-3">
      <Row className="align-items-center">
        <Col xs={4} sm={3}>
          <span className="icon-stack">
            <SquareFill className="icon-stack-3x" />
            <Icon iconName={iconName} className="icon-stack-2x text-light" />
          </span>
        </Col>
        <Col xs={8} sm={9}>
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

export default HorizontalIconCard;
