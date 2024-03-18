import {
  Col,
  Container,
  Row,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
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
import { toast } from "react-toastify";

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

  function addCube(form: AddCubeForm) {
    post("/cube/add", form).then(async (_resp) => {
      // TODO show some kind of success thing
      const cube = (await _resp.json()) as Cube;
      toast.success("Cube added");
      navigate("/cubes/" + cube.id);
    });
  }

  const {
    control,
    register,
    handleSubmit,
    getFieldState,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<AddCubeForm>({
    mode: "onChange",
    reValidateMode: "onChange",
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

  async function setImage() {
    const url = getScryfallUrl(selectedCard.id);
    setValue("imageUrl", url);
    await trigger("imageUrl");
    setCardImageUrl(url);
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
        <Form noValidate onSubmit={handleSubmit(addCube)}>
          <Row>
            <Col xs={6}>
              <FloatingLabel
                controlId="title"
                label="Cube name"
                className="mb-3"
              >
                <Form.Control
                  {...register("title", {
                    required: "Please enter a title",
                  })}
                  type="text"
                  placeholder="Number One Cube"
                  className={
                    getFieldState("title").isDirty
                      ? getFieldState("title").invalid
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }
                />
                <p className="text-danger">
                  {errors.title && errors.title.message}
                </p>
              </FloatingLabel>
            </Col>
            <Col xs={6}>
              <FloatingLabel
                controlId="owner"
                label="Cube designer"
                className="mb-3"
              >
                <Form.Control
                  {...register("owner", {
                    required:
                      "Please enter the name of the cube owner/designer",
                  })}
                  type="text"
                  placeholder="Jedit Ojanen"
                  className={
                    getFieldState("owner").isDirty
                      ? getFieldState("owner").invalid
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }
                />
                <p className="text-danger">
                  {errors.owner && errors.owner.message}
                </p>
              </FloatingLabel>
            </Col>
            <Col xs={12}>
              <FloatingLabel
                controlId="description"
                label="Cube description"
                className="mb-3"
              >
                <Form.Control
                  {...register("description", {
                    required: "Please enter a description",
                  })}
                  type="text"
                  placeholder="This cube is all about..."
                  className={
                    getFieldState("description").isDirty
                      ? getFieldState("description").invalid
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }
                />
                <p className="text-danger">
                  {errors.description && errors.description.message}
                </p>
              </FloatingLabel>
            </Col>

            <Col xs={12}>
              <FloatingLabel
                controlId="url"
                label="Link to cube list (e.g. Cube Cobra)"
                className="mb-3"
              >
                <Form.Control
                  {...register("url", {
                    required: "Please enter the URL to the cube list",
                    pattern: {
                      value: new RegExp(
                        "/(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?/"
                      ),
                      message: "Please enter a valid URL",
                    },
                  })}
                  type="url"
                  placeholder="http://example.com/"
                  className={
                    getFieldState("url").isDirty
                      ? getFieldState("url").invalid
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }
                />
                <p className="text-danger">
                  {errors.url && errors.url.message}
                </p>
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Controller
                control={control}
                name="imageUrl"
                rules={{
                  required: "Choose a display image",
                }}
                // selected card currently not getting passed back properly
                render={() => (
                  <MTGAutocompleteInput
                    labelText={"Choose display image"}
                    setSelectedCard={setSelectedCard}
                  />
                )}
              />
              <p className="text-danger">
                {errors.imageUrl && errors.imageUrl.message}
              </p>
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
