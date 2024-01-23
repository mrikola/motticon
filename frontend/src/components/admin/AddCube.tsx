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
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useIsAdmin } from "../../utils/auth";
import Loading from "../general/Loading";

type AddCubeForm = {
  title: string;
  description: string;
  url: string;
  owner: string;
  imageUrl: string;
};

function AddCube() {
  const user = useIsAdmin();

  function addCube({ title, description, url, owner, imageUrl }: AddCubeForm) {
    post("/cube/add", { title, description, url, owner, imageUrl }).then(
      async (_resp) => {
        // TODO show some kind of success thing
        console.log(_resp);
      }
    );
  }

  const { register, handleSubmit } = useForm<AddCubeForm>({
    defaultValues: {
      title: "",
      description: "",
      url: "",
      owner: "",
      imageUrl: "",
    },
  });

  return user ? (
    <Container className="mt-3 my-md-4">
      <HelmetProvider>
        <Helmet>
          <title>MottiCon &#9632; Add cube</title>
        </Helmet>
      </HelmetProvider>
      <Col>
        <h1 className="display-1">Add Cube</h1>
      </Col>
      <Row>
        <Form onSubmit={handleSubmit(addCube)}>
          <Row>
            <Col xs={6}>
              <FloatingLabel
                controlId="title"
                label="Cube name"
                className="mb-3"
              >
                <Form.Control
                  {...register("title")}
                  required
                  type="text"
                  placeholder="Number One Cube"
                />
              </FloatingLabel>
            </Col>
            <Col xs={6}>
              <FloatingLabel
                controlId="owner"
                label="Cube designer"
                className="mb-3"
              >
                <Form.Control
                  {...register("owner")}
                  required
                  type="text"
                  placeholder="Jedit Ojanen"
                />
              </FloatingLabel>
            </Col>
            <Col xs={12}>
              <FloatingLabel
                controlId="description"
                label="Cube description"
                className="mb-3"
              >
                <Form.Control
                  {...register("description")}
                  required
                  type="text"
                  placeholder="This cube is all about..."
                />
              </FloatingLabel>
            </Col>
          </Row>

          <Col xs={12}>
            <FloatingLabel
              controlId="url"
              label="Link to cube list (e.g. Cube Cobra)"
              className="mb-3"
            >
              <Form.Control
                {...register("url")}
                required
                type="url"
                placeholder="http://example.com/"
              />
            </FloatingLabel>
          </Col>
          <Col xs={12}>
            <FloatingLabel
              controlId="imageUrl"
              label="Display image"
              className="mb-3"
            >
              <Form.Control
                {...register("imageUrl")}
                type="url"
                placeholder="http://example.com/"
              />
            </FloatingLabel>
          </Col>
          <Col xs={12} className="d-grid">
            <Button variant="primary" type="submit">
              Add cube
            </Button>
          </Col>
        </Form>
      </Row>
    </Container>
  ) : (
    <Loading />
  );
}

export default AddCube;
