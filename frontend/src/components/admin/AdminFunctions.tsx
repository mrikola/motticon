import { Button, Col, Container, Row } from "react-bootstrap";
import Loading from "../../components/general/Loading";
import { useIsAdmin } from "../../utils/auth";
import { PersonFillGear } from "react-bootstrap-icons";
import HelmetTitle from "../../components/general/HelmetTitle";
import { Card, ListedCard } from "../../types/Card";
import { get } from "../../services/ApiService";

const AdminFunctions = () => {
  const user = useIsAdmin();

  const generateCardDb = async () => {
    if (user) {
      const response = await get(`/generateCardDb`);
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

  const deleteOrphans = async () => {
    console.log("trying to delete orphans");
    const response = await get(`/listedcards/deleteOrphans`);
    const cards = (await response.json()) as ListedCard[];
    console.log(cards);
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

  const search = async () => {
    const value = "tarm";
    const response = await get(`/card/search2/${encodeURIComponent(value)}`);
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
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default AdminFunctions;
