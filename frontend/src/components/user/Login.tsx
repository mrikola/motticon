import { useState } from "react";
import { useNavigate } from "react-router";
import { post } from "../../services/ApiService";
import { getUserInfoFromJwt } from "../../utils/auth";
import { Button, Col, Container, Row, Form, Select, FloatingLabel } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const doLogin = () => {
    post("/login", { email, password }).then(async (resp) => {
      const jwt = await resp.text();
      if (jwt !== null) {
        localStorage.setItem("user", jwt);
        localStorage.setItem("userInfo", await getUserInfoFromJwt(jwt));
        navigate("/profile");
      }
    });
  };

<FloatingLabel
        controlId="floatingInput"
        label="Email address"
        className="mb-3"
      >
        <Form.Control type="email" placeholder="name@example.com" />
      </FloatingLabel>
  return (
    <Container>
      <Row>
        <Col>
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
          <FloatingLabel
            controlId="password"
            label="Password"
            className="mb-3"
          >
          <Form.Control 
            type="password"
            value={password}
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
          </FloatingLabel>
        <Button variant="primary" type="submit" onClick={() => doLogin()}>
          Login
        </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
