import { Col, Container, Row } from "react-bootstrap";

function Loading() {
  return (
    <Container className="mt-3 my-md-4">
      <Row>
        <Col xs={12}>
          <h3>Loading...</h3>
        </Col>
      </Row>
    </Container>
  );
}

export default Loading;
