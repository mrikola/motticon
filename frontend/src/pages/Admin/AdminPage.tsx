import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../components/general/Loading";
import { useIsAdmin } from "../../utils/auth";
import { TrophyFill } from "react-bootstrap-icons";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ResetResults from "../../components/admin/ResetResults";
import { useEffect, useState } from "react";
import { get } from "../../services/ApiService";
import { Tournament, TournamentsByType } from "../../types/Tournament";

const AdminPage = () => {
  const user = useIsAdmin();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const tournamentTypes: (keyof TournamentsByType)[] = [
    "ongoing",
    "future",
    "past",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await get("/tournaments/ongoing");
      const tourneys = (await response.json()) as Tournament[];
      console.log(tourneys);
      setTournaments(tourneys);
    };
    fetchData();
  }, []);

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
