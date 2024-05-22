import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { post } from "../../services/ApiService";
import CubeAutocompleteInput from "../../components/general/CubeAutocompleteInput";
import { CardAndQuantity, ListedCard, PickedCard } from "../../types/Cube";
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

  const getUsedCardsQuantity = () => {
    return usedCards.reduce((n, { quantityPicked }) => n + quantityPicked, 0);
  };

  useEffect(() => {
    if (automaticallyAddedCards.length === 0) {
      console.log("computer vision called");
      const url = photoUrl;
      // placeholder to be able to test from localhost
      // const url =
      //   "https://motticon-backend-prod.fly.dev/photos/2/200/Teemu_Halonen.jpeg";
      try {
        post("/computerVision/cardsFromImageUrl", { url, cubeCards }).then(
          async (resp) => {
            const cards = (await resp.json()) as ListedCard[];
            addToAutomaticallyAddedCards(cards);
            setAutomaticallyIdentifiedCards(cards.length);
            // console.log(cards);
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
    for (const card of cards) {
      const cq: CardAndQuantity = {
        listedCard: card,
        quantityPicked: 1,
      };
      newCards.push(cq);
    }
    newCards.sort((a, b) =>
      a.listedCard.card.name.localeCompare(b.listedCard.card.name)
    );
    setAutomaticallyAddedCards((automaticallyAddedCards) => [
      ...new Set([...automaticallyAddedCards, ...newCards]),
    ]);
  };

  const removeFromAutomaticallyAddedCards = (card: ListedCard) => {
    setAutomaticallyAddedCards((automaticallyAddedCards) =>
      automaticallyAddedCards.filter(
        (c) => c.listedCard.card.id != card.card.id
      )
    );
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
