import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Container, Row, Form, Select, FloatingLabel } from "react-bootstrap";
import {
  Box,
  Image,
  SquareFill,
} from "react-bootstrap-icons";


function PublicProfile() {
  const [draftResults, setDrafts] = useState([]);

  // generate 3x dummy drafts and 3x dummy matches per draft for page generation
  const resultVariations = [
    { id: '0', value: '2-0' },
    { name: '1', value: '2-1' },
    { name: '3', value: '1-2' },
    { name: '4', value: '0-2' },
  ];
  useState(() => {
    for (let drafts = 1; drafts <= 3; drafts++) {
      const draftMatchResults = [];
      for (let matches = 1; matches <= 3; matches++) {
        // random result
        const resultRandomizer = Math.floor(Math.random() * 4);
        const result = resultVariations[resultRandomizer].value;

        draftMatchResults.push({
          id: matches,
          opponentName: "Vihu Numero"+matches,
          matchResult: result
        });
      }
      draftResults.push({
        id: drafts,
        results: draftMatchResults
      });
    }
  }, []);

  return (
    <Container className="mt-3 my-md-4">
      <Row>
        <h1 className="display-1">Timo Tuuttari</h1>
      </Row>
      <Row>
        <Container>
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
                  <Card.Title className="round-card-title">
                  Match points
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
                  <p className="icon-stack-2x text-light">2</p>
                </span>
              </Col>
              <Col xs={9}>
                <Card.Body className="round-card-body">
                  <Card.Title className="round-card-title">
                  Drafts won
                  </Card.Title>
                </Card.Body>
              </Col>
            </Row>
        </Card>
        </Container>
      </Row>
      {draftResults.map((draft) => (
        <Row key={draft.id}>
        <Col xs={12} className="text-center">
          <h3>Draft {draft.id}</h3>
          {draft.results.map((result) => (
            <Row key={result.id}>
            <Col xs={4}>
              <p>John Doe</p>
            </Col>
            <Col xs={4}>
              <p>{result.matchResult}</p>
            </Col>
            <Col xs={4}>
              <p>{result.opponentName}</p>
            </Col>
          </Row>
          ))}
          </Col>
      </Row>
      ))}
    </Container>
  );
}

export default PublicProfile;
