import { Card, Col, Placeholder, Row } from "react-bootstrap";
import PageContainer from "./PageContainer";

function LoadingCubes() {
  return (
    <PageContainer>
      <Col>
        <Placeholder.Button xs={6} />
      </Col>
      <Row>
        <Col>
          <h1 className="display-1 placeholder-wave">
            <Placeholder xs={4} aria-hidden="true" />
          </h1>
          <h2 className="display-3 placeholder-wave">
            <Placeholder xs={3} aria-hidden="true" />
          </h2>
        </Col>
      </Row>
      <Row xs={1} sm={1} md={2} lg={3} className="g-3">
        <Col className="cube-card">
          <Card
            className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 cube-card-image"
            border="light"
          >
            <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
              <h3 className="pt-4 mt-5 mb-4 display-4 lh-1 placeholder-wave">
                <Placeholder xs={4} />
              </h3>
              <Card.Subtitle className="icon-link mt-auto placeholder-wave">
                <Placeholder xs={4} aria-hidden="true" />
              </Card.Subtitle>
              <hr></hr>
              <p className="mb-0 placeholder-wave">
                <Placeholder xs={6} aria-hidden="true" />
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}

export default LoadingCubes;
