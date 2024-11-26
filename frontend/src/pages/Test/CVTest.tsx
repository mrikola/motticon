import { get, post } from "../../services/ApiService";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
// import { toast } from "react-toastify";
import { Fragment, useEffect, useState } from "react";
import { Cube } from "../../types/Cube";
import {
  CardAndQuantity,
  ComputerVisionDto,
  ListedCard,
  Token,
} from "../../types/Card";
// import Flatbush from "flatbush";

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
  match: boolean;
  // neighbors: number;
};

type OCRBox = {
  rectangle: Rectangle;
  text: string;
};

const CVTest = () => {
  // const [cubeCards, setCubeCards] = useState<ListedCard[]>([]);
  const [cube, setCube] = useState<Cube>();
  const [identifiedCards, setIdentifiedCards] = useState<CardAndQuantity[]>([]);
  const [poolImageUrl, setPoolImageUrl] = useState<string>("");
  const [viewboxWidth, setViewboxWidth] = useState<number>(0);
  const [viewboxHeight, setViewboxHeight] = useState<number>(0);
  // const [flatbush, setFlatbush] = useState<Flatbush>();
  const [ocrBoxes, setOcrBoxes] = useState<OCRBox[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);

  // hard coded to get the mono u cube via ID
  useEffect(() => {
    const cubeId = 1;
    if (!cube) {
      const fetchData = async () => {
        const resp = await get(`/cube/${cubeId}`);
        const cube = (await resp.json()) as Cube;
        setCube(cube);
        console.log(cube);
      };
      fetchData();
    }
  }, []);

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
          const cardInCube = cube.cardlist?.cards.find(
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
            await generateBoxes(data);
            // todo: iterate through polygons and calculate near neighbours for each, use that number to color the boxes
            setPoolImageUrl(url);
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getTokens = async () => {
    const tokens: Token[] = [];
    for (const cq of identifiedCards) {
      if (cq.listedCard.card.tokens) {
        for (const token of cq.listedCard.card.tokens) {
          console.log("processing token: " + token.name);
          const existingTokens = tokens.filter(
            (t) =>
              t.name === token.name &&
              t.oracleText === token.oracleText &&
              t.power === token.power &&
              t.toughness === token.toughness
          );
          if (existingTokens.length > 0) {
            existingTokens[0].tokenFor.push(cq.listedCard.card);
          } else {
            tokens.push({ ...token, tokenFor: [cq.listedCard.card] });
          }
        }
      }
    }
    setTokens(tokens);
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
        // neighbors: 0,
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

    // set Flatbush based on number of rectangles
    // const fb = new Flatbush(rects.length);
    // for (const rect of rects) {
    //   fb.add(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height);
    // }
    // fb.finish();
    // setFlatbush(fb);
    // for (const rect of rects) {
    //   const neighbors = fb.neighbors(rect.x, rect.y, 20, dto.imageWidth / 15);
    //   if (neighbors) {
    //     rect.neighbors = neighbors.length;
    //   }
    // }
    setOcrBoxes(ocr);
  };

  // test function to see how many neighbors are near
  // const findNeighbors = (x: number, y: number, distance: number) => {
  //   if (flatbush) {
  //     console.log(flatbush);
  //     const n = flatbush.neighbors(x, y, 20, distance);
  //     console.log("neighbours found: " + n);
  //   }
  // };

  return (
    <Container>
      <h1>computer vision test</h1>
      <Row>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            className="btn btn-info btn-lg"
            onClick={() =>
              getCardsFromUrl(
                "http://motticon-backend.fly.dev/photos/14/471/Kim_Valori.jpeg"
              )
            }
          >
            <div className="icon-link text-light">Get Kim cards</div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            className="btn btn-info btn-lg"
            onClick={() =>
              getCardsFromUrl(
                "http://motticon-backend.fly.dev/photos/14/472/Roope_Metsa.jpeg"
              )
            }
          >
            <div className="icon-link text-light">Get Roope cards</div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            className="btn btn-info btn-lg"
            onClick={() =>
              getCardsFromUrl(
                "http://motticon-backend.fly.dev/photos/14/474/Markku_Rikola.jpeg"
              )
            }
          >
            <div className="icon-link text-light">Get Markku cards</div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            className="btn btn-info btn-lg"
            onClick={() =>
              getCardsFromUrl(
                "http://motticon-backend.fly.dev/photos/14/473/Andrei_Hayrynen.jpeg"
              )
            }
          >
            <div className="icon-link text-light">Get Andrei cards</div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            className="btn btn-info btn-lg"
            onClick={() =>
              getCardsFromUrl(
                "http://motticon-backend.fly.dev/photos/14/475/Donald_Smith.jpeg"
              )
            }
          >
            <div className="icon-link text-light">Get Donald cards</div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            className="btn btn-info btn-lg"
            onClick={() =>
              getCardsFromUrl(
                "http://motticon-backend.fly.dev/photos/14/476/Juha_Ihonen.jpeg"
              )
            }
          >
            <div className="icon-link text-light">Get Juha cards</div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            className="btn btn-info btn-lg"
            onClick={() =>
              getCardsFromUrl(
                "http://motticon-backend.fly.dev/photos/14/477/Max_Sjoblom.jpeg"
              )
            }
          >
            <div className="icon-link text-light">Get Max cards</div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            className="btn btn-info btn-lg"
            onClick={() =>
              getCardsFromUrl(
                "http://motticon-backend.fly.dev/photos/14/478/Sakari_Castren.jpeg"
              )
            }
          >
            <div className="icon-link text-light">Get Sakari cards</div>
          </Button>
        </Col>

        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            className="btn btn-info btn-lg"
            onClick={() =>
              getCardsFromUrl(
                "https://uc63a653a4c7c5eafc91a31ca9e8.previews.dropboxusercontent.com/p/thumb/ACTRUqMrYZo7gqSlw66GRwQnZSwUApCq8BXN1QSM2VZ2W1Kx0gpZBl8hH1z3ICWk8KyC94pO3Q2ETMJCxpuGkyHhuilKnjyGA--NqjYqhOQI73nmYuJ0NHDdRu6YS1prWcU9TCl6-wWn_QRnfo2nWYbP4-KWHi8f-aW8tDGMoZBFVOTmtXSSKFFs9N6tCsf3d8mRRx5SFPYIEqJH7VdtHX_-GBcSg2os__zbTgQl7aUhddFAoeVlHxdxiaZaXseSUxeQ55Tie6N1h4e0dUnQ_4i7lYAnYz7e0vN9-cg8wjsYLr1G1qYIT6sVEQ6kx63hFhpfmJnzACeaP7gV7Z11KQUZm_seVEtLS_XMB2ZuMF7I6peXOOFBYrZmkamku8zyzWuPYlj2PSQSdm_DvF1DO1BVptHvR3aPQVSJd8LDwPfvtUAKiXAPLn84ybRPVXqMeeVl5wXqzEI1zDfn-tTzQQE1/p.jpeg?is_prewarmed=true"
              )
            }
          >
            <div className="icon-link text-light">
              Get Max vintage cube cards
            </div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button className="btn btn-info btn-lg" onClick={() => getTokens()}>
            <div className="icon-link text-light">Get tokens</div>
          </Button>
        </Col>

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
        {tokens.length > 0 && (
          <Col xs={12}>
            <p className="lead">Your tokens</p>
            <Row>
              {tokens.map((token, index) => (
                <Col xs={4} className="mb-3" key={index}>
                  <img
                    key={index}
                    className="cube-token"
                    src={`https://cards.scryfall.io/normal/front/${token.scryfallId.charAt(
                      0
                    )}/${token.scryfallId.charAt(1)}/${token.scryfallId}.jpg`}
                  />
                  {token.tokenFor.map((tokenGenerator) => (
                    <p key={tokenGenerator.id}>{tokenGenerator.name}</p>
                  ))}
                </Col>
              ))}
            </Row>
          </Col>
        )}
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

export default CVTest;
