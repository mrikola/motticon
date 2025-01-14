import { get, post } from "../../services/ApiService";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useState } from "react";
import { Cube } from "../../types/Cube";
import {
  Card,
  CardAndQuantity,
  ComputerVisionDto,
  ListedCard,
} from "../../types/Card";
import { Deck } from "../../cv/Deck";

const DeckCheckTest = () => {
  // const [cubeCards, setCubeCards] = useState<ListedCard[]>([]);
  const [cube, _setCube] = useState<Cube>();
  const [identifiedCards, setIdentifiedCards] = useState<CardAndQuantity[]>([]);
  const [poolImageUrl, setPoolImageUrl] = useState<string>("");
  const [playerDeck, setPlayerDeck] = useState<Deck>();

  // hard coded to get the mono u cube via ID
  // useEffect(() => {
  //   const cubeId = 1;
  //   if (!cube) {
  //     const fetchData = async () => {
  //       const resp = await get(`/cube/${cubeId}`);
  //       const cube = (await resp.json()) as Cube;
  //       setCube(cube);
  //       console.log(cube);
  //     };
  //     fetchData();
  //   }
  // }, []);

  const getDeck = async () => {
    const deck: Deck = new Deck();
    await fetch(`./enchantress.txt`)
      .then((response) => response.text())
      .then(async (fileText) => {
        const lines = fileText.split("\n");
        for (const line of lines) {
          const separated = line.split("x ");
          console.log(separated[0] + "x " + separated[1]);
          const quantity = Number(separated[0]);
          const resp = await get(`/card/name/${separated[1]}`);
          const card = (await resp.json()) as Card;
          for (let i = 1; i < quantity; ++i) {
            deck.addCard(card, false);
          }
        }
      });
    setPlayerDeck(deck);
  };

  const addToIdentifiedCards = (cards: ListedCard[]) => {
    const newCards: CardAndQuantity[] = [];
    if (cube) {
      for (const card of cards) {
        // check if card already exists in list
        const existingCard = newCards.filter(
          (c) => c.listedCard.card.scryfallId === card.card.scryfallId
        );
        if (existingCard.length > 0) {
          // check if there are more in the cube
          const cardInCube = cube.cardlist?.cards?.find(
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
      setIdentifiedCards((identifiedCards) => [
        ...new Set([...identifiedCards, ...newCards]),
      ]);
    }
  };

  const getCardsFromUrl = async (url: string) => {
    if (cube) {
      const cubeCards: ListedCard[] = cube.cardlist?.cards ?? [];
      try {
        console.log("attempting computer vision for: " + url);
        post("/computerVision/cardsFromImageUrl", { url, cubeCards }).then(
          async (resp) => {
            const data = (await resp.json()) as ComputerVisionDto;
            console.log(data);
            setIdentifiedCards([]);
            const cards: ListedCard[] = [];
            for (const obj of data.cvCards) {
              if (obj.listedCard) {
                cards.push(obj.listedCard);
              }
            }
            addToIdentifiedCards(cards);
            setPoolImageUrl(url);
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Container>
      <h1>computer vision test</h1>
      <Row>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            className="btn btn-info btn-lg"
            onClick={() =>
              getCardsFromUrl(
                "https://lh3.googleusercontent.com/pw/AP1GczPwSng08-pn1sNIHtf5B_VuyZkUk2xdiUUbqv4i163Z2Ggx1kuxpyxR0kzY5EM_40mmrcZEzHvXAFnJUKjA1p4tYW9ArqrY2ACt7yUmxBFGxEfNlKs-Xztp0oZnwyB6rsYMDQ0vdSsAq-iJlwoBNnvZjoMFtnMp3QqB1uAs93uUS_oI3rMWH86498vUbKgUcvmOAr8ekirsLusQHRhT3cLW_xR4mRrRzPjHzBhgVFSLe3wU5J3MiJ8464fQ2eDXi4fb53VxZwPfT0YmECgHzl3g6QKgwr0IiSGzT-tAJmQ7Hc_qbRscm-cXS4JCakTHWsooL9i9Lbm0iRESgVrq_utYgy8ANGpV8FQs5p6sSr332mNjH3kGdMn4TATtU0-FvN2iphFPa1MUQRCeBEnIreMxosk0m_QFja4_PtxJogXOuPZNsY7fKDV00QfwbEfSPWt35rHuZD2TKe3Y_KiOn_G7Z5jIx7Uds_It7mu6sVgEnxrl_ya-9vhdA1CJWUBm4uhErGf71Wt7f8AAJHzpVDyA4hSP2TO9tsqgFA8snTZk8WhXwtQ5IExccvw9OikycoVPiKu41BOMiyVTjvZqnHeduCKTEAYg5tXDnO9bWfVoFxvzdYech7UiM8M557tPabt0tMf4GedC0IEuRb9sy8nviRCx0tD3sF4sse_rEkfn8eldrT_vbPmggKZ3KjiCnpPpDwdnwUTLI7pK6mMSaxH3FEA_yAW_TIVha3MHFqw3XafJ_unlxTvw6MOrcVJoUFcEHYVvAWM-fDnsdopz70eaf9kmvCfVeNvrd-djrualCxQdmMnpvX3jlVDzfLK-4tfAG4vvi_MQQGV3zVsuC2c9DF_gRHGRJfENZs6iOgc1-tvR17gfVC5zdXIdGKMS4L46McW_xCe-8Uyq-Xz_pLre7A=w2182-h1636-s-no-gm?authuser=0"
              )
            }
          >
            <div className="icon-link text-light">Get tokens</div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button className="btn btn-info btn-lg" onClick={getDeck}>
            <div className="icon-link text-light">Get decklist</div>
          </Button>
          {playerDeck?.getMaindeck().map((cardInDeck) => (
            <p>
              {cardInDeck.quantity}x {cardInDeck.card.name}
            </p>
          ))}
        </Col>
        <Col xs={12}>
          <div className="pool-wrapper">
            <img src={poolImageUrl} draggable="false" />
          </div>
        </Col>
        <Col xs={12}>
          <p className="lead">Player deck</p>
          <p>{playerDeck?.toString()}</p>
        </Col>
        <Col xs={12}>
          <p className="lead">Detected</p>
          <Table striped borderless responsive>
            <tbody>
              {identifiedCards.map((qcCard, index) => (
                <tr key={index}>
                  <td className="small p-1">
                    {index + 1}. {qcCard.listedCard.card.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default DeckCheckTest;
