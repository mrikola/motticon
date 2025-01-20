import { Button, Col, Container, Row } from "react-bootstrap";
import Loading from "../../components/general/Loading";
import { useIsAdmin } from "../../utils/auth";
import { PersonFillGear } from "react-bootstrap-icons";
import HelmetTitle from "../../components/general/HelmetTitle";
import { Card, ListedCard, PickedCard, Token } from "../../types/Card";
import { get } from "../../services/ApiService";

const AdminFunctions = () => {
  const user = useIsAdmin();

  const generateCardDb = async () => {
    if (user) {
      const response = await get(`/card/db/generate`);
      const cards = (await response.json()) as Card[];
      console.log(cards);
    }
  };

  const getCardDb = async () => {
    if (user) {
      const response = await get(`/getCardDb`);
      const cards = (await response.json()) as Card[];
      console.log(cards);
    }
  };

  const updateCardDb = async () => {
    if (user) {
      const response = await get(`/updateCardDb`);
      const cards = (await response.json()) as Card[];
      console.log(cards);
    }
  };

  const getAllTokens = async () => {
    if (user) {
      const response = await get(`/getAllTokens`);
      const tokens = (await response.json()) as Token[];
      console.log(tokens);
    }
  };

  const getAllPickedCards = async () => {
    if (user) {
      const response = await get(`/getAllPickedCards`);
      const cards = (await response.json()) as PickedCard[];
      console.log(cards);
    }
  };

  const deleteOrphans = async () => {
    console.log("trying to delete orphans");
    const response = await get(`/listedcards/deleteOrphans`);
    const cards = (await response.json()) as ListedCard[];
    console.log(cards);
  };

  const removeAllPicked = async () => {
    console.log("trying to remove all picked cards");
    const response = await get(`/pickedcards/removeAll`);
    const success = (await response.json()) as boolean;
    console.log(success);
  };

  // const getRandomCards = async () => {
  //   const response = await get(`/cube/2/pickedCards/generateRandom/4`);
  //   const card = (await response.json()) as PickedCard[];
  //   console.log(card);
  // };

  const dryRunUsers = async () => {
    const response = await get(`/dryrunusers`);
    const data = await response.json();
    console.log(data);
  };

  const getById = async () => {
    const scryfallId = "764a906c-8b27-4ffa-bdc3-7825c6919d3e";
    if (user) {
      const response = await get(`/card/id/${scryfallId}`);
      const cards = (await response.json()) as Card;

      console.log(cards);
    }
  };

  const search = async () => {
    const value = "tarm";
    const response = await get(`/card/search/${encodeURIComponent(value)}`);
    // const r = await response.json();
    // console.log(r);
    const resp = (await response.json()) as Card[];
    console.log(resp);
  };

  return user ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText="Admin" />
      <Row className="my-3">
        <Col xs={12}>
          <h1 className="display-1">Admin functions</h1>
        </Col>
      </Row>
      <Row>
        <h2>User-related</h2>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            variant="danger"
            className="btn btn-info btn-lg"
            onClick={dryRunUsers}
          >
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> Generate dry-run users
            </div>
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <h2>Card DB</h2>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            variant="danger"
            className="btn btn-info btn-lg"
            onClick={generateCardDb}
          >
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> Generate card database
            </div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button className="btn btn-info btn-lg" onClick={getCardDb}>
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> Get card database
            </div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            variant="warning"
            className="btn btn-lg"
            onClick={updateCardDb}
          >
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> Update card database
            </div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button className="btn btn-info btn-lg" onClick={getAllTokens}>
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> Get all tokens
            </div>
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <h2>Cards</h2>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            variant="danger"
            className="btn btn-lg"
            onClick={deleteOrphans}
          >
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> DELETE orphans
            </div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            variant="danger"
            className="btn btn-lg"
            onClick={removeAllPicked}
          >
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> REMOVE all picked
            </div>
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <h2>Testing</h2>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button variant="danger" className="btn btn-lg" onClick={search}>
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> Do search
            </div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button
            variant="primary"
            className="btn btn-lg"
            onClick={getAllPickedCards}
          >
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> Get all picked cards
            </div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button variant="primary" className="btn btn-lg" onClick={getById}>
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> Get by scryfall id
            </div>
          </Button>
        </Col>
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default AdminFunctions;
