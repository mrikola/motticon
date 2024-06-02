import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../components/general/Loading";
import { useIsAdmin } from "../../utils/auth";
import { Box, PersonFillGear, TrophyFill } from "react-bootstrap-icons";
import HelmetTitle from "../../components/general/HelmetTitle";
import { Card } from "../../types/Card";
import { get } from "../../services/ApiService";

const AdminPage = () => {
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

  const resetCardDb = async () => {
    if (user) {
      const response = await get(`/resetCardDb`);
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

  const getTestCardById = async () => {
    const response = await get(`/card/id/efae4d84-8134-461a-a352-a5bdff7259a7`);
    const card = (await response.json()) as Card;
    console.log(card);
  };

  // const getTestCardByName = async () => {
  //   const cardname = "The Mightstone and Weakstone";
  //   const response = await get(`/card/name/${encodeURIComponent(cardname)}`);
  //   const card = (await response.json()) as Card;
  //   console.log(card);
  // };

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

  return user ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText="Admin" />
      <Row className="my-3">
        <Col xs={12}>
          <h1 className="display-1">Admin page</h1>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
          <Link to="/admin/create-tournament" className="btn btn-info btn-lg">
            <div className="icon-link text-light">
              <TrophyFill className="fs-3" /> Create tournament
            </div>
          </Link>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Link to="/admin/add-cube" className="btn btn-info btn-lg">
            <div className="icon-link text-light">
              <Box className="fs-3" /> Add cube
            </div>
          </Link>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Link to="/admin/manage-users" className="btn btn-info btn-lg">
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> Manage users
            </div>
          </Link>
        </Col>
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
          <Button
            variant="danger"
            className="btn btn-info btn-lg"
            onClick={resetCardDb}
          >
            <div className="icon-link text-light">
              <PersonFillGear className="fs-3" /> Reset card database
            </div>
          </Button>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto mt-3">
          <Button className="btn btn-info btn-lg" onClick={getTestCardById}>
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

export default AdminPage;
