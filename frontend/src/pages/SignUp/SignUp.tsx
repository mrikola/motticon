import {
  Button,
  Col,
  Container,
  Row,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { post } from "../../services/ApiService";
import { useNavigate } from "react-router";

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

function SignUp() {
  const navigate = useNavigate();

  function createAccount({ firstName, lastName, email, password }: SignupForm) {
    post("/signup", { firstName, lastName, email, password }).then(
      async (_resp) => {
        // TODO show some kind of success thing
        navigate("/login");
      }
    );
  }

  const { register, handleSubmit } = useForm<SignupForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  return (
    <Container className="mt-3 my-md-4">
      <Col>
        <h1 className="display-1">Create account</h1>
      </Col>
      <Row>
        <Form onSubmit={handleSubmit(createAccount)}>
          <Row>
            <Col xs={6}>
              <FloatingLabel
                controlId="firstName"
                label="First name"
                className="mb-3"
              >
                <Form.Control
                  {...register("firstName")}
                  type="text"
                  placeholder="Jedit"
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
                  {...register("lastName")}
                  type="text"
                  placeholder="Ojanen"
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Col xs={12}>
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
          </Col>
          <Col xs={12}>
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
          <Col xs={12} className="d-grid">
            <Button variant="primary" type="submit">
              Create account
            </Button>
          </Col>
        </Form>
      </Row>
    </Container>
  );
}

export default SignUp;
