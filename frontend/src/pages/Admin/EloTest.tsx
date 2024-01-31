import { Button, Col, Container, Row } from "react-bootstrap";
import Loading from "../../components/general/Loading";
import { useIsAdmin } from "../../utils/auth";
import { GraphUp } from "react-bootstrap-icons";
import { get, post } from "../../services/ApiService";
import HelmetTitle from "../../components/general/HelmetTitle";

const EloTest = () => {
  const user = useIsAdmin();

  const updateElo = () => {
    console.log("update elo pressed");
    const kValue = 8;
    const player1Id = 1;
    const player2Id = 2;
    const winnerNumber = 1;
    post(`/updateElo`, {
      kValue,
      player1Id,
      player2Id,
      winnerNumber,
    }).then(async (resp) => {
      const jwt = await resp.text();
      if (jwt !== null) {
        console.log(jwt);
      }
    });
  };

  const resetRating1 = () => {
    get(`/resetElo/1`).then(async (resp) => {
      const jwt = await resp.text();
      if (jwt !== null) {
        console.log(jwt);
      }
    });
  };
  const resetRating2 = () => {
    get(`/resetElo/2`).then(async (resp) => {
      const jwt = await resp.text();
      if (jwt !== null) {
        console.log(jwt);
      }
    });
  };

  const getUser1 = () => {
    get(`/user/1`).then(async (resp) => {
      const jwt = await resp.text();
      if (jwt !== null) {
        console.log(jwt);
      }
    });
  };

  const getUser2 = () => {
    get(`/user/2`).then(async (resp) => {
      const jwt = await resp.text();
      if (jwt !== null) {
        console.log(jwt);
      }
    });
  };

  return user ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText="Elo Test" />
      <Row className="my-3">
        <Col xs={12}>
          <h1 className="display-1">Admin page</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Button variant="primary" onClick={updateElo} className="btn-lg">
            <GraphUp /> Update Elo rating
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Button variant="primary" onClick={getUser1} className="btn-lg">
            <GraphUp /> Get user 1
          </Button>
        </Col>
        <Col xs={6}>
          <Button variant="danger" onClick={resetRating1} className="btn-lg">
            <GraphUp /> Reset rating for 1
          </Button>
        </Col>
        <Col xs={6}>
          <Button variant="primary" onClick={getUser2} className="btn-lg">
            <GraphUp /> Get user 2
          </Button>
        </Col>
        <Col xs={6}>
          <Button variant="danger" onClick={resetRating2} className="btn-lg">
            <GraphUp /> Reset rating for 2
          </Button>
        </Col>
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default EloTest;
