import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { get, post } from "../../services/ApiService";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import HelmetTitle from "../../components/general/HelmetTitle";

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function SignUp() {
  const navigate = useNavigate();

  function createAccount({ firstName, lastName, email, password }: SignupForm) {
    post("/user/signup", { firstName, lastName, email, password }).then(
      async (_resp) => {
        // TODO show some kind of success thing
        navigate("/login");
      }
    );
    toast.success("Account succesfully created");
  }

  const {
    register,
    handleSubmit,
    getFieldState,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText="Sign up" />
      <Col>
        <h1 className="display-1">Create account</h1>
      </Col>
      <Row>
        <Form noValidate onSubmit={handleSubmit(createAccount)}>
          <Row>
            <Col xs={6}>
              <FloatingLabel
                controlId="firstName"
                label="First name"
                className="mb-3"
              >
                <Form.Control
                  {...register("firstName", {
                    required: "Please enter your first name",
                  })}
                  type="text"
                  placeholder=""
                  className={
                    getFieldState("firstName").isDirty
                      ? getFieldState("firstName").invalid
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }
                />
                <p className="text-danger">
                  {errors.firstName && errors.firstName.message}
                </p>
              </FloatingLabel>
            </Col>
            <Col xs={6}>
              <FloatingLabel
                controlId="lastName"
                label="Last name"
                className="mb-3"
              >
                <Form.Control
                  {...register("lastName", {
                    required: "Please enter your last name",
                  })}
                  type="text"
                  placeholder="Ojanen"
                  className={
                    getFieldState("lastName").isDirty
                      ? getFieldState("lastName").invalid
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }
                />
                <p className="text-danger">
                  {errors.lastName && errors.lastName.message}
                </p>
              </FloatingLabel>
            </Col>
          </Row>
          <Col xs={12}>
            <FloatingLabel controlId="email" label="Email address">
              <Form.Control
                {...register("email", {
                  required: "Please enter an email address",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address format",
                  },
                  validate: {
                    check: async (fieldValue) => {
                      const resp = await get(`/user/${fieldValue}`);
                      const exists = (await resp.json()) as boolean;
                      return exists == false || "Email already registered";
                    },
                  },
                })}
                type="email"
                placeholder="Enter email"
                className={
                  getFieldState("email").isDirty
                    ? getFieldState("email").invalid
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }
              />
              <p className="text-danger">
                {errors.email && errors.email.message}
              </p>
            </FloatingLabel>
          </Col>
          <Col xs={12}>
            <FloatingLabel
              controlId="password"
              label="Password"
              className="mb-3"
            >
              <Form.Control
                {...register("password", {
                  required: "Please enter a password",
                })}
                type="password"
                placeholder="Password"
                className={
                  getFieldState("password").isDirty
                    ? getFieldState("password").invalid
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }
              />
              <p className="text-danger">
                {errors.password && errors.password.message}
              </p>
            </FloatingLabel>
          </Col>
          <Col xs={12}>
            <FloatingLabel
              controlId="confirmPassword"
              label="Confirm Password"
              className="mb-3"
            >
              <Form.Control
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: {
                    match: (val: string) => {
                      if (watch("password") != val) {
                        return "Your passwords do not match";
                      }
                    },
                  },
                })}
                type="password"
                placeholder="Password"
                className={
                  getFieldState("confirmPassword").isDirty
                    ? getFieldState("confirmPassword").invalid
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }
              />
              <p className="text-danger">
                {errors.confirmPassword && errors.confirmPassword.message}
              </p>
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
