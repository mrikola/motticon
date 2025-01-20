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
import { CubeCard } from "../../types/Card";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

type AddCubeForm = {
  title: string;
  description: string;
  url: string;
  owner: string;
  imageUrl: string;
  cubecobraId: string;
  cards: CubeCard[];
};

function AddCube() {
  const user = useIsAdmin();
  const navigate = useNavigate();
  const [cardImageUrl, setCardImageUrl] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<Item>();
  const [getCubecobraDataDisabled, setGetCubecobraDataDisabled] =
    useState<boolean>(false);
  const [cubeDataText, setCubeDataText] = useState<string>("");

  function addCube(form: AddCubeForm) {
    console.log(form);
    post("/cube/add", form).then(async (resp) => {
      const cube = (await resp.json()) as Cube;
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
    getValues,
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
      cubecobraId: "",
      cards: undefined,
    },
  });

  function getScryfallUrl(id: string) {
    const baseUrl = "https://cards.scryfall.io/art_crop/front/";
    const uniqueUrl = id.charAt(0) + "/" + id.charAt(1) + "/" + id + ".jpg";
    return baseUrl + uniqueUrl;
  }

  const queryStarted = () =>
    toast("Getting data, please wait...", {
      type: "warning",
      autoClose: false,
      toastId: "uploadToast",
    });

  const querySuccess = () =>
    toast.update("uploadToast", {
      render: "Got data successfully",
      type: "success",
      autoClose: 2000,
    });

  const queryFailed = () =>
    toast.update("uploadToast", {
      render: "Getting data failed",
      type: "error",
      autoClose: 2000,
    });

  async function getCubecobraData(id: string) {
    queryStarted();
    setGetCubecobraDataDisabled(true);
    try {
      const response = await fetch(
        "https://cubecobra.com/cube/api/cubeJSON/" + id,
        {
          method: "GET",
          mode: "cors",
        }
      );
      const data = await response.json();
      const cards: CubeCard[] = [];
      // const tokens: Token[] = [];
      let totalcards: number = 0;
      for (const card of data.cards.mainboard) {
        const match = cards.find(
          (c) => c.scryfallId === card.details.scryfall_id
        );
        if (match) {
          match.quantity++;
          totalcards++;
        } else {
          totalcards++;
          cards.push({
            scryfallId: card.details.scryfall_id,
            quantity: 1,
          });
        }
      }
      if (cards.length > 0) {
        querySuccess();
        console.log(cards);
        setCubeDataText(
          "Loaded " +
            cards.length +
            " unique cards (" +
            totalcards +
            " total cards) from " +
            data.name
        );
        setValue("cards", cards);
      }
    } catch (error) {
      console.error(error);
      setCubeDataText("Error getting cube data");
      queryFailed();
    }
  }

  async function setImage() {
    const url = getScryfallUrl(selectedCard.id);
    setValue("imageUrl", url);
    await trigger("imageUrl");
    setCardImageUrl(url);
  }

  const cubecobraIdChanged = (value: string) => {
    const url = "https://cubecobra.com/cube/overview/" + value;
    setValue("url", url);
  };

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
            <Col xs={6}>
              <Form.Control hidden {...register("url")}></Form.Control>
              <FloatingLabel
                controlId="cubecobraId"
                label="Cubecobra ID"
                className="mb-3"
              >
                <Form.Control
                  {...register("cubecobraId", {
                    required: "Please enter the Cubecobra ID",
                  })}
                  type="text"
                  placeholder="abc123"
                  className={
                    getFieldState("cubecobraId").isDirty
                      ? getFieldState("cubecobraId").invalid
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }
                  onChange={(e) => cubecobraIdChanged(e.target.value)}
                />
                <p className="text-danger">
                  {errors.owner && errors.owner.message}
                </p>
              </FloatingLabel>
            </Col>
            <Col xs={6}>
              <Button
                variant="primary"
                className="btn-lg"
                disabled={getCubecobraDataDisabled}
                onClick={() => getCubecobraData(getValues("cubecobraId"))}
              >
                Get cube data
              </Button>
              <p>{cubeDataText}</p>
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
