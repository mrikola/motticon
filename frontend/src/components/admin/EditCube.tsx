import {
  Col,
  Container,
  Row,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { get, post } from "../../services/ApiService";
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
import { CubeCard } from "../../types/Card";

type EditCubeForm = {
  cubeId: number;
  title: string;
  description: string;
  url: string;
  owner: string;
  imageUrl: string;
  cubecobraId: string;
  cards: CubeCard[];
};

function EditCube() {
  const user = useIsAdmin();
  const navigate = useNavigate();
  const { cubeId } = useParams();
  const [cardImageUrl, setCardImageUrl] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<Item>();
  const [currentInfo, setCurrentInfo] = useState<Cube>();
  const [getCubecobraDataDisabled, setGetCubecobraDataDisabled] =
    useState<boolean>(false);
  const [cubeDataText, setCubeDataText] = useState<string>("");

  function editCube(form: EditCubeForm) {
    console.log("sending:");
    console.log(form);
    post("/cube/edit", form).then(async (_resp) => {
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
      const cubeCards: CubeCard[] = [];
      for (const card of cube.cardlist?.cards ?? []) {
        cubeCards.push({
          scryfallId: card.card.scryfallId,
          quantity: card.quantityInCube,
        });
      }
      setValue("cards", cubeCards);

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
    getValues,
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
        },
      );
      const data = await response.json();
      const cards: CubeCard[] = [];
      let totalcards: number = 0;
      for (const card of data.cards.mainboard) {
        const match = cards.find(
          (c) => c.scryfallId === card.details.scryfall_id,
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
            data.name,
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

  return user && currentInfo ? (
    <Container className="mt-3 my-md-4">
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
            <h3>Cards</h3>
            <p>{getValues("cards").length} cards currently in cube</p>
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
    </Container>
  ) : (
    <Loading />
  );
}

export default EditCube;
