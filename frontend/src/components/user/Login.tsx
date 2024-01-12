import { useNavigate } from "react-router";
import { post } from "../../services/ApiService";
import { getUserInfoFromJwt } from "../../utils/auth";
import {
  Button,
  Col,
  Container,
  Row,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { useForm } from "react-hook-form";

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const doLogin = ({ email, password }: LoginForm) => {
    post("/login", { email, password }).then(async (resp) => {
      const jwt = await resp.text();
      if (jwt !== null) {
        localStorage.setItem("user", jwt);
        localStorage.setItem("userInfo", await getUserInfoFromJwt(jwt));
        navigate("/");
      }
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit(doLogin)}>
            <FloatingLabel
              controlId="email"
              label="Email address"
              className="mb-3"
            >
              <Form.Control
                {...register("email")}
                type="email"
                placeholder="Enter email"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="password"
              label="Password"
              className="mb-3"
            >
              <Form.Control
                {...register("password")}
                type="password"
                placeholder="Password"
              />
            </FloatingLabel>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
