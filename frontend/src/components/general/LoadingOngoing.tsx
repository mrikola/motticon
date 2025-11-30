import { Card, Col, Placeholder, Row } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";
import PageContainer from "./PageContainer";

function LoadingOngoing() {
  return (
    <PageContainer>
      <Col>
        <Placeholder.Button xs={6} />
      </Col>
      <Row>
        <Col>
          <h1>
            <Placeholder xs={4} aria-hidden="true" />
          </h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            <Placeholder xs={6} aria-hidden="true" />
          </p>
          <p>
            <Placeholder xs={8} aria-hidden="true" />
          </p>
          <Card className="horizontal-card mb-3">
            <Row className="align-items-center">
              <Col xs={4} sm={3} md={2}>
                <span className="icon-stack">
                  <SquareFill className="icon-stack-3x" />
                  <Placeholder xs={4} aria-hidden="true" />
                </span>
              </Col>
              <Col xs={8} sm={9} md={10}>
                <Card.Body className="horizontal-card-body">
                  <Placeholder as={Card.Title}>
                    <Placeholder xs={6} aria-hidden="true" />
                  </Placeholder>
                </Card.Body>
              </Col>
            </Row>
          </Card>

          <Col>
            <Placeholder xs={12} aria-hidden="true" />
            <Placeholder xs={4} aria-hidden="true" />
          </Col>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Placeholder xs={8} aria-hidden="true" />
        </Col>
        <Col className="text-center">
          <Placeholder xs={2} aria-hidden="true" />
        </Col>
        <Col className="text-center">
          <Placeholder xs={8} aria-hidden="true" />
        </Col>

        <Col className="d-grid gap-2 my-3">
          <Placeholder.Button />
        </Col>
      </Row>
    </PageContainer>
  );
}

export default LoadingOngoing;
