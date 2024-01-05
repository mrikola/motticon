import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Container, Row, Form, Select, FloatingLabel } from "react-bootstrap";
import {
  Box,
  Image,
  SquareFill
} from "react-bootstrap-icons";


function RoundOngoing() {

  return (
    <Container className="mt-3 my-md-4">
      <Row>
        <h1 className="display-1">Round: 5</h1>
      </Row>
      <Row>
        <Container>
        <Card className="round-card mb-3">
          <Row>
              <Col xs={3}>
                <span className="icon-stack">
                  <SquareFill className="icon-stack-3x" />
                  <p className="icon-stack-2x text-light">7</p>
                </span>
              </Col>
              <Col xs={9}>
                <Card.Body className="round-card-body">
                  <Card.Title className="round-card-title">
                  Table
                  </Card.Title>
                </Card.Body>
              </Col>
            </Row>
        </Card>
        </Container>
      </Row>
      <Row className="my-3">
        <Col>
         <Link to={"/draftOngoing"}>
            <Button variant="danger">
              Swap to draft ongoing
            </Button>
          </Link>
         </Col>
      </Row>
    </Container>
  );
}

export default RoundOngoing;
