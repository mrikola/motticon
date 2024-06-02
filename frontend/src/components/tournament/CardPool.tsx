import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { Fragment, useEffect, useState } from "react";
import { post } from "../../services/ApiService";
import CubeAutocompleteInput from "../../components/general/CubeAutocompleteInput";
import {
  CardAndQuantity,
  ComputerVisionDto,
  ListedCard,
  PickedCard,
} from "../../types/Card";
import { XCircleFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { DraftPodSeat } from "../../types/Tournament";
import CardPoolProgressBar from "../general/CardPoolProgressBar";

type Props = {
  cubeCards: ListedCard[];
  cubeId: number;
  photoUrl: string | undefined;
  seat: DraftPodSeat;
  setPlayerPickedCards: (cards: PickedCard[]) => void;
};

type PickedCardDto = {
  listedCard: ListedCard;
  quantityPicked: number;
  picker: DraftPodSeat;
};

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
  match: boolean;
};

type OCRBox = {
  rectangle: Rectangle;
  text: string;
};

const CardPool = ({
  cubeCards,
  cubeId,
  photoUrl,
  seat,
  setPlayerPickedCards,
}: Props) => {
  const [usedCards, setUsedCards] = useState<CardAndQuantity[]>([]);
  const [automaticallyAddedCards, setAutomaticallyAddedCards] = useState<
    CardAndQuantity[]
  >([]);
  const [manuallyAddedCards, setManuallyAddedCards] = useState<
    CardAndQuantity[]
  >([]);
  const [automaticallyIdentifiedCards, setAutomaticallyIdentifiedCards] =
    useState<number>(0);
  const [poolImageUrl, setPoolImageUrl] = useState<string>("");
  const [viewboxWidth, setViewboxWidth] = useState<number>(0);
  const [viewboxHeight, setViewboxHeight] = useState<number>(0);
  const [ocrBoxes, setOcrBoxes] = useState<OCRBox[]>([]);

  const getUsedCardsQuantity = () => {
    return usedCards.reduce((n, { quantityPicked }) => n + quantityPicked, 0);
  };

  useEffect(() => {
    if (automaticallyAddedCards.length === 0) {
      console.log("computer vision called");
      // const url = photoUrl;
      // placeholder to be able to test from localhost
      const url =
        "https://motticon-backend.fly.dev/photos/14/478/Sakari_Castren.jpeg";
      try {
        post("/computerVision/cardsFromImageUrl", { url, cubeCards }).then(
          async (resp) => {
            const data = (await resp.json()) as ComputerVisionDto;
            console.log(data);
            setAutomaticallyAddedCards([]);
            const cards: ListedCard[] = [];
            for (const obj of data.cvCards) {
              if (obj.listedCard) {
                cards.push(obj.listedCard);
              }
            }
            addToAutomaticallyAddedCards(cards);
            setAutomaticallyIdentifiedCards(cards.length);
            await generateBoxes(data);
            setPoolImageUrl(url);
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  // update the total used cards when either manually or automatically is updated
  useEffect(() => {
    setUsedCards([...manuallyAddedCards, ...automaticallyAddedCards]);
  }, [automaticallyAddedCards, manuallyAddedCards]);

  // todo: for all these, reafactor to take quantityInCube into account
  const addToManuallyAddedCards = (cards: ListedCard[]) => {
    const newCards: CardAndQuantity[] = [];
    for (const card of cards) {
      const cq: CardAndQuantity = {
        listedCard: card,
        quantityPicked: 1,
      };
      newCards.push(cq);
    }
    setManuallyAddedCards((manuallyAddedCards) => [
      ...new Set([...manuallyAddedCards, ...newCards]),
    ]);
    for (const cq of newCards) {
      toast.success(cq.listedCard.card.name + " added");
    }
  };

  const removeFromManuallyAddedCards = (listedCard: ListedCard) => {
    setManuallyAddedCards((manuallyAddedCards) =>
      manuallyAddedCards.filter(
        (c) => c.listedCard.card.id != listedCard.card.id
      )
    );
    toast.warning(listedCard.card.name + " removed");
  };

  const addToAutomaticallyAddedCards = (cards: ListedCard[]) => {
    const newCards: CardAndQuantity[] = [];
    if (cubeCards) {
      for (const card of cards) {
        // check if card already exists in list
        const existingCard = newCards.filter(
          (c) => c.listedCard.card.scryfallId === card.card.scryfallId
        );
        if (existingCard.length > 0) {
          // check if there are more in the cube
          const cardInCube = cubeCards.find(
            (c) => c.card.scryfallId === card.card.scryfallId
          );
          if (
            cardInCube &&
            existingCard[0].quantityPicked < cardInCube.quantityInCube
          ) {
            existingCard[0].quantityPicked++;
          }
        } else {
          const cq: CardAndQuantity = {
            listedCard: card,
            quantityPicked: 1,
          };
          newCards.push(cq);
        }
      }
      newCards.sort((a, b) =>
        a.listedCard.card.name.localeCompare(b.listedCard.card.name)
      );
      setAutomaticallyAddedCards((automaticallyAddedCards) => [
        ...new Set([...automaticallyAddedCards, ...newCards]),
      ]);
    }
  };

  const removeFromAutomaticallyAddedCards = (card: ListedCard) => {
    const existingCard = automaticallyAddedCards.filter(
      (c) => c.listedCard.card.id === card.card.id
    );
    // if more than one has been picked, remove only one
    if (existingCard[0].quantityPicked > 1) {
      existingCard[0].quantityPicked--;
    } else {
      setAutomaticallyAddedCards((automaticallyAddedCards) =>
        automaticallyAddedCards.filter(
          (c) => c.listedCard.card.id != card.card.id
        )
      );
    }

    toast.warning(card.card.name + " removed");
  };

  const setPickedCards = () => {
    const pickedCards: PickedCardDto[] = [];
    // move used cards to suitable format
    for (const card of usedCards) {
      const pc: PickedCardDto = {
        listedCard: card.listedCard,
        quantityPicked: card.quantityPicked,
        picker: seat,
      };
      pickedCards.push(pc);
    }
    try {
      post(`/cube/${cubeId}/pickedCards/set`, { pickedCards }).then(
        async (resp) => {
          const cards = (await resp.json()) as PickedCard[];
          if (cards) {
            //console.log(cards);
            setPlayerPickedCards(cards);
            //console.log("success")
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const generateBoxes = async (dto: ComputerVisionDto) => {
    if (dto.imageHeight && dto.imageWidth) {
      setViewboxWidth(dto.imageWidth);
      setViewboxHeight(dto.imageHeight);
    }
    const rects: Rectangle[] = [];
    const ocr: OCRBox[] = [];
    for (const obj of dto.cvCards) {
      let x, y, width, height;
      // in order to handle landscape and portrait images, set width/height according to the larger of two options
      if (
        obj.polygon[1].x - obj.polygon[0].x >
        obj.polygon[0].x - obj.polygon[3].x
      ) {
        width = obj.polygon[1].x - obj.polygon[0].x;
      } else {
        width = obj.polygon[0].x - obj.polygon[3].x;
      }
      if (
        obj.polygon[3].y - obj.polygon[0].y >
        obj.polygon[1].y - obj.polygon[0].y
      ) {
        height = obj.polygon[3].y - obj.polygon[0].y;
      } else {
        height = obj.polygon[1].y - obj.polygon[0].y;
      }
      // use width:height ratio to determine if text in image is vertical (if) or horizontal (else)
      if (width > height) {
        x = obj.polygon[0].x;
        y = obj.polygon[0].y;
      } else {
        x = obj.polygon[3].x;
        y = obj.polygon[3].y;
      }
      const rect: Rectangle = {
        x: x,
        y: y,
        width: width,
        height: height,
        match: obj.matchFound,
      };
      if (rect.width > 0 && rect.height > 0) {
        if (obj.listedCard) {
          ocr.push({ rectangle: rect, text: obj.listedCard.card.name });
        } else {
          ocr.push({ rectangle: rect, text: obj.text });
        }
        rects.push(rect);
      }
    }
    setOcrBoxes(ocr);
  };

  if (automaticallyAddedCards.length > 0) {
    return (
      <Container>
        <Row>
          <p>
            The system has identified {automaticallyIdentifiedCards} cards from
            your photo. Please correct any mistakes and add missing cards, then
            submit your draft pool.
          </p>
        </Row>
        <hr />

        <Row>
          <Col xs={12}>
            <h2>Your current draft pool:</h2>
            <CardPoolProgressBar
              cardsAdded={usedCards.length}
              cardsNeeded={45}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="d-grid gap-2 mx-auto">
            <Button
              variant="primary"
              className="btn-lg my-3"
              disabled={usedCards.length < 45}
              onClick={() => setPickedCards()}
            >
              Submit cards
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className="pool-wrapper">
              <img src={poolImageUrl} draggable="false" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={"0, 0," + viewboxWidth + ", " + viewboxHeight}
                preserveAspectRatio="xMinYMin meet"
              >
                {ocrBoxes.map((box, index) => (
                  <Fragment key={index}>
                    <rect
                      key={index + "-r"}
                      x={box.rectangle.x}
                      y={box.rectangle.y}
                      width={box.rectangle.width}
                      height={box.rectangle.height}
                      className={box.rectangle.match ? "is-match" : "not-match"}
                    />
                    <text
                      key={index + "-t"}
                      x={box.rectangle.x}
                      y={
                        box.rectangle.width > box.rectangle.height
                          ? box.rectangle.y + box.rectangle.height
                          : box.rectangle.y
                      }
                      transform={
                        box.rectangle.width > box.rectangle.height
                          ? ""
                          : "rotate(90, " +
                            box.rectangle.x +
                            ", " +
                            box.rectangle.y +
                            ")"
                      }
                    >
                      {box.text}
                    </text>
                  </Fragment>
                ))}
              </svg>
            </div>
          </Col>
        </Row>
        <Row>
          <CubeAutocompleteInput
            labelText={"Add card"}
            cubeCards={cubeCards}
            usedCards={usedCards}
            addToUsedCards={addToManuallyAddedCards}
            disabled={getUsedCardsQuantity() >= 45 || cubeCards.length === 0}
          />
        </Row>
        <hr />
        <Row>
          <Col xs={6}>
            <p className="lead">Manually added</p>
            <Table striped borderless responsive>
              <tbody>
                {manuallyAddedCards.map((qcCard, index) => (
                  <tr key={index}>
                    <td>
                      <XCircleFill
                        className="text-danger fs-4"
                        onClick={() =>
                          removeFromManuallyAddedCards(qcCard.listedCard)
                        }
                      />
                    </td>
                    <td className="small p-1">{qcCard.listedCard.card.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col xs={6}>
            <p className="lead">Detected</p>
            <Table striped borderless responsive>
              <tbody>
                {automaticallyAddedCards.map((qcCard, index) => (
                  <tr key={index}>
                    <td>
                      <XCircleFill
                        className="text-danger fs-5"
                        onClick={() =>
                          removeFromAutomaticallyAddedCards(qcCard.listedCard)
                        }
                      />
                    </td>
                    <td className="small p-1">{qcCard.listedCard.card.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  } else {
    return (
      <Container>
        <h3>Loading cards from deck photo...</h3>
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status" className="big-spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }
};

export default CardPool;
