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
import { Link } from "react-router-dom";
import { BoxArrowInRight, PersonPlusFill } from "react-bootstrap-icons";
import HelmetTitle from "../../components/general/HelmetTitle";

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  console.log("api URL", import.meta.env.VITE_API_URL);

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
    <Container className="mt-3 my-md-4 text-center">
      <HelmetTitle titleText="Login" />
      <Row>
        <h1 className="display-1">MottiCon</h1>
      </Row>
      <Row>
        <Form onSubmit={handleSubmit(doLogin)}>
          <Col xs={12} lg={6} xxl={4} className="d-grid gap-2 mx-auto">
            <h2>Already have an account? Log in.</h2>
          </Col>
          <Col xs={12} lg={6} xxl={4} className="d-grid gap-2 mx-auto">
            <FloatingLabel
              controlId="email"
              label="Email address"
              className="mb-3"
            >
              <Form.Control
                {...register("email")}
                type="text"
                placeholder="Enter email"
              />
            </FloatingLabel>
          </Col>
          <Col xs={12} lg={6} xxl={4} className="d-grid gap-2 mx-auto">
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
          </Col>
          <Col xs={12} lg={6} xxl={4} className="d-grid gap-2 mx-auto">
            <Button variant="primary" type="submit">
              <BoxArrowInRight className="fs-4" /> Login
            </Button>
          </Col>
        </Form>
      </Row>
      <Row className="my-3">
        <Col xs={12} lg={6} xxl={4} className="d-grid gap-2 mx-auto">
          <h2>No account yet? Sign up.</h2>
          <Link to="/signup" className="btn btn-primary">
            <PersonPlusFill className="fs-4" /> Sign up
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
