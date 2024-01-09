import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Form,
  FloatingLabel,
} from "react-bootstrap";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  function createAccount() {
    // todo actual account creation
  }

  return (
    <Container className="mt-3 my-md-4">
      <Col>
        <h1 className="display-1">Create account</h1>
      </Col>
      <Row>
        <Col xs={6}>
          <FloatingLabel
            controlId="firstName"
            label="First name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              value={firstName}
              placeholder="Jedit"
              onChange={(event) => setFirstName(event.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col xs={6}>
          <FloatingLabel
            controlId="lastName"
            label="Last name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              value={lastName}
              placeholder="Ojanen"
              onChange={(event) => setLastName(event.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col xs={12}>
          <FloatingLabel
            controlId="email"
            label="Email address"
            className="mb-3"
          >
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col xs={12}>
          <FloatingLabel controlId="password" label="Password" className="mb-3">
            <Form.Control
              type="password"
              value={password}
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col xs={12} className="d-grid">
          <Button
            variant="primary"
            type="submit"
            onClick={() => createAccount()}
          >
            Create account
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
