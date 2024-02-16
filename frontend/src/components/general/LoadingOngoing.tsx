import { Card, Col, Container, Placeholder, Row } from "react-bootstrap";
import { SquareFill } from "react-bootstrap-icons";

function LoadingOngoing() {
  return (
    <Container className="mt-3 my-md-4">
      <Col xs={12}>
        <Placeholder.Button xs={6} />
      </Col>
      <Row>
        <Col xs={12}>
          <h1>
            <Placeholder xs={4} aria-hidden="true" />
          </h1>
        </Col>
      </Row>
      <Row>
        <Container>
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

          <Col xs={12}>
            <Placeholder xs={12} aria-hidden="true" />
            <Placeholder xs={4} aria-hidden="true" />
          </Col>
        </Container>
      </Row>
      <Row>
        <Col xs={12} className="text-center">
          <Placeholder xs={8} aria-hidden="true" />
        </Col>
        <Col xs={12} className="text-center">
          <Placeholder xs={2} aria-hidden="true" />
        </Col>
        <Col xs={12} className="text-center">
          <Placeholder xs={8} aria-hidden="true" />
        </Col>

        <Col xs={12} className="d-grid gap-2 my-3">
          <Placeholder.Button />
        </Col>
      </Row>
    </Container>
  );
}

export default LoadingOngoing;
