import {
  Col,
  Row,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { get, put } from "../../services/ApiService";
import { useIsAdmin } from "../../utils/auth";
import Loading from "../general/Loading";
import { useEffect, useState } from "react";
import { Item } from "react-datalist-input";
import HelmetTitle from "../general/HelmetTitle";
import BackButton from "../general/BackButton";
import MTGAutocompleteInput from "../general/MTGAutocompleteInput";
import { Cube } from "../../types/Cube";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import PageContainer from "../general/PageContainer";

type EditCubeForm = {
  cubeId: number;
  title: string;
  description: string;
  url: string;
  owner: string;
  imageUrl: string;
  maxPlayersSupported: number;
};

function EditCube() {
  const user = useIsAdmin();
  const navigate = useNavigate();
  const { cubeId } = useParams();
  const [cardImageUrl, setCardImageUrl] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<Item>();
  const [currentInfo, setCurrentInfo] = useState<Cube>();

  function editCube(form: EditCubeForm) {
    console.log("sending:");
    console.log(form);
    put("/cube/edit", form).then(async (_resp) => {
      // TODO show some kind of success thing
      const cube = (await _resp.json()) as Cube;
      toast.success("Cube edited");
      navigate("/cubes/" + cube.id);
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/cube/${cubeId}`);
      const cube = (await resp.json()) as Cube;
      setCurrentInfo(cube);
      console.log(cube);
      setValue("cubeId", cube.id);
      setValue("title", cube.title);
      setValue("description", cube.description);
      setValue("url", cube.url);
      setValue("owner", cube.owner ?? "");
      setValue("imageUrl", cube.imageUrl ?? "");
      setValue("maxPlayersSupported", cube.maxPlayersSupported ?? 8);

      setCardImageUrl(cube.imageUrl ?? "");
    };

    fetchData();
  }, [cubeId]);

  const {
    control,
    register,
    handleSubmit,
    getFieldState,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<EditCubeForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      url: "",
      owner: "",
      imageUrl: "",
      maxPlayersSupported: 8,
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

  return user && currentInfo ? (
    <PageContainer>
      <HelmetTitle titleText="Add cube" />
      <Row>
        <BackButton buttonText="Back to admin" path="/admin" />
        <Col xs={12}>
          <h1 className="display-1">Edit Cube</h1>
        </Col>
      </Row>
      <Row>
        <Form noValidate onSubmit={handleSubmit(editCube)}>
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
          </Row>
          <Row>
            <Col xs={6}>
              <Form.Control hidden {...register("url")}></Form.Control>
              <FloatingLabel controlId="url" label="URL" className="mb-3">
                <Form.Control
                  {...register("url", {
                    required: "Please enter URL",
                  })}
                  type="text"
                  placeholder="abc123"
                />
                <p className="text-danger">
                  {errors.url && errors.url.message}
                </p>
              </FloatingLabel>
            </Col>
            <Col xs={6}>
              <FloatingLabel
                controlId="maxPlayersSupported"
                label="Max players supported"
                className="mb-3"
              >
                <Form.Control
                  {...register("maxPlayersSupported", {
                    required: "Please enter the maximum players supported",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Max players supported must be at least 1",
                    },
                  })}
                  type="number"
                  placeholder="8"
                  className={
                    getFieldState("maxPlayersSupported").isDirty
                      ? getFieldState("maxPlayersSupported").invalid
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }
                />
                <p className="text-danger">
                  {errors.maxPlayersSupported &&
                    errors.maxPlayersSupported.message}
                </p>
                <p className="small">
                  Maximum number of players this cube can support in a draft pod
                  (typically 8 or 10)
                </p>
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <h3>Display image</h3>
            <Col xs={6}>
              <Controller
                control={control}
                name="imageUrl"
                rules={{
                  required: "Choose a display image",
                }}
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
                Save edits
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </PageContainer>
  ) : (
    <Loading />
  );
}

export default EditCube;
