import { Col, Row } from "react-bootstrap";
import PageContainer from "./PageContainer";

function Loading() {
  return (
    <PageContainer>
      <Row>
        <Col>
          <h3>Loading...</h3>
        </Col>
      </Row>
    </PageContainer>
  );
}

export default Loading;
