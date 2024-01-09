import { Link } from "react-router-dom";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import { Box, Image, SquareFill } from "react-bootstrap-icons";

function DraftOngoing() {
  return (
    <Container className="mt-3 my-md-4">
      <Row>
        <h1 className="display-1">Draft: 2</h1>
      </Row>
      <Row>
        <Container>
          <Card className="round-card mb-3">
            <Row className="align-items-center">
              <Col xs={3}>
                <span className="icon-stack">
                  <SquareFill className="icon-stack-3x" />
                  <Box className="icon-stack-2x text-light" />
                </span>
              </Col>
              <Col xs={9}>
                <Card.Body className="round-card-body">
                  <Card.Title className="round-card-title-small align-middle">
                    A Pretty Long Cube Name
                  </Card.Title>
                </Card.Body>
              </Col>
            </Row>
          </Card>
          <Card className="round-card mb-3">
            <Row>
              <Col xs={3}>
                <span className="icon-stack">
                  <SquareFill className="icon-stack-3x" />
                  <p className="icon-stack-2x text-light">4</p>
                </span>
              </Col>
              <Col xs={9}>
                <Card.Body className="round-card-body">
                  <Card.Title className="round-card-title">Pod</Card.Title>
                </Card.Body>
              </Col>
            </Row>
          </Card>
          <Card className="round-card mb-3">
            <Row>
              <Col xs={3}>
                <span className="icon-stack">
                  <SquareFill className="icon-stack-3x" />
                  <p className="icon-stack-2x text-light">2</p>
                </span>
              </Col>
              <Col xs={9}>
                <Card.Body className="round-card-body">
                  <Card.Title className="round-card-title">Seat</Card.Title>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Container>
      </Row>
      <Row>
        <h2>Draft pool submission</h2>
        <p>
          After the draft, please submit a photo showing all the cards you have
          drafted.
        </p>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Draft pool photo</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
        <div className="d-grid gap-2">
          <Button variant="primary">
            <Image /> Submit pool photo
          </Button>
        </div>
      </Row>
    </Container>
  );
}

export default DraftOngoing;
