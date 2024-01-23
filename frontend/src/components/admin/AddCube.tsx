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
import { useMemo, useState } from "react";
import DatalistInput, { Item } from "react-datalist-input";

type AddCubeForm = {
  title: string;
  description: string;
  url: string;
  owner: string;
  imageUrl: string;
};

function AddCube() {
  const user = useIsAdmin();
  const [cardImageUrl, setCardImageUrl] = useState<string>("");
  const [item, setItem] = useState<Item>(); // The selected item will be stored in this state.
  const [value, setValue] = useState<string>();

  // placeholder cards for testing
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Exploration",
      set: "DMR",
      imageUrl:
        "https://cards.scryfall.io/art_crop/front/5/b/5b372045-a4a0-44c8-96ec-1e201d61ed26.jpg",
    },
    {
      id: 2,
      name: "Exploration",
      set: "2XM",
      imageUrl:
        "https://cards.scryfall.io/art_crop/front/c/e/ce4c6535-afea-4704-b35c-badeb04c4f4c.jpg",
    },
    {
      id: 3,
      name: "Exploration",
      set: "USG",
      imageUrl:
        "https://cards.scryfall.io/art_crop/front/2/f/2f09e451-0246-45a2-8bfd-07d3c65ddfe6.jpg",
    },
  ]);

  // Make sure each option has an unique id and a value
  const items = useMemo(
    () =>
      cards.map((card) => ({
        // required: id and value
        value: card.name + " (" + card.set + ")",
        // optional: label, node
        // label: option.name, // use a custom label instead of the value
        // node: option.name, // use a custom ReactNode to display the option
        ...card, // pass along any other properties to access in your onSelect callback
      })),
    [cards]
  );

  function addCube({ title, description, url, owner }: AddCubeForm) {
    const imageUrl = cardImageUrl;
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

  function setImage(item: Item) {
    setCardImageUrl(item.imageUrl);
  }

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
              <DatalistInput
                label="Choose display image"
                placeholder="Type to search for card..."
                items={items}
                selectedItem={item}
                value={value}
                setValue={(value) => setValue(value)}
                onSelect={(item) => {
                  setImage(item);
                }}
              />
            </Col>
            <Col xs={6}>
              <img src={cardImageUrl} className="add-cube-image " />
            </Col>
          </Row>
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
