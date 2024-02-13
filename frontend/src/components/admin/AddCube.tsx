import {
  Col,
  Container,
  Row,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { post } from "../../services/ApiService";
import { useIsAdmin } from "../../utils/auth";
import Loading from "../general/Loading";
import { useEffect, useState } from "react";
import { Item } from "react-datalist-input";
import HelmetTitle from "../general/HelmetTitle";
import BackButton from "../general/BackButton";
import MTGAutocompleteInput from "../general/MTGAutocompleteInput";
import { Cube } from "../../types/Cube";
import { useNavigate } from "react-router";

type AddCubeForm = {
  title: string;
  description: string;
  url: string;
  owner: string;
  imageUrl: string;
};

function AddCube() {
  const user = useIsAdmin();
  const navigate = useNavigate();
  const [cardImageUrl, setCardImageUrl] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<Item>();

  function addCube({ title, description, url, owner }: AddCubeForm) {
    const imageUrl = cardImageUrl;
    post("/cube/add", { title, description, url, owner, imageUrl }).then(
      async (_resp) => {
        // TODO show some kind of success thing
        const cube = (await _resp.json()) as Cube;
        navigate("/cubes/" + cube.id);
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

  function getScryfallUrl(id: string) {
    const baseUrl = "https://cards.scryfall.io/art_crop/front/";
    const uniqueUrl = id.charAt(0) + "/" + id.charAt(1) + "/" + id + ".jpg";
    return baseUrl + uniqueUrl;
  }

  function setImage() {
    setCardImageUrl(getScryfallUrl(selectedCard.id));
  }

  useEffect(() => {
    if (selectedCard) {
      setImage();
    }
  }, [selectedCard]);

  return user ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText="Add cube" />
      <Row>
        <BackButton buttonText="Back to admin" path="/admin" />
        <Col xs={12}>
          <h1 className="display-1">Add Cube</h1>
        </Col>
      </Row>

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
          </Row>
          <Row>
            <Col xs={6}>
              <MTGAutocompleteInput
                labelText={"Choose display image"}
                setSelectedCard={setSelectedCard}
              />
            </Col>
            <Col xs={6}>
              <img src={cardImageUrl} className="add-cube-image" />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12} className="d-grid">
              <Button variant="primary" type="submit" className="btn-lg">
                Add Cube
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </Container>
  ) : (
    <Loading />
  );
}

export default AddCube;
