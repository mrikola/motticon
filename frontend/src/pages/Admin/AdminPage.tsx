import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../components/general/Loading";
import { useIsAdmin } from "../../utils/auth";
import { GraphUp, TrophyFill } from "react-bootstrap-icons";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ResetResults from "../../components/admin/ResetResults";
import { useEffect, useState } from "react";
import { get, post } from "../../services/ApiService";
import { Tournament } from "../../types/Tournament";

const AdminPage = () => {
  const user = useIsAdmin();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get("/tournaments/ongoing");
      const tourneys = (await response.json()) as Tournament[];
      console.log(tourneys);
      setTournaments(tourneys);
    };
    fetchData();
  }, []);

  const updateElo = () => {
    console.log("update elo pressed");
    const player1Id = 1;
    const player2Id = 2;
    post(`/updateElo`, {
      player1Id,
      player2Id,
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

  const getUser3 = () => {
    get(`/user/2`).then(async (resp) => {
      const jwt = await resp.text();
      if (jwt !== null) {
        console.log(jwt);
      }
    });
  };

  return user ? (
    <Container className="mt-3 my-md-4">
      <HelmetProvider>
        <Helmet>
          <title>MottiCon &#9632; Admin</title>
        </Helmet>
      </HelmetProvider>
      <Row className="my-3">
        <Col xs={12}>
          <h1 className="display-1">Admin page</h1>
        </Col>
        <Col xs={12}>
          <Link to="/admin/create-tournament">
            <Button variant="primary">
              <TrophyFill /> Create tournament
            </Button>
          </Link>
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
          <Button variant="primary" onClick={getUser3} className="btn-lg">
            <GraphUp /> Get user 2
          </Button>
        </Col>
        <Col xs={6}>
          <Button variant="danger" onClick={resetRating2} className="btn-lg">
            <GraphUp /> Reset rating for 2
          </Button>
        </Col>
      </Row>
      <Row className="my-3">
        <Col xs={12}>
          <h2>Reset results</h2>
          <p>Purely a test functionality, REMOVE FOR LIVE VERSION</p>
          <p>Button resets all results for the most recent ongoing round.</p>
          <ResetResults tournaments={tournaments} />
        </Col>
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default AdminPage;
