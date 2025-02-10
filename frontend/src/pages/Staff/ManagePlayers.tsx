import { Col, Container, Row } from "react-bootstrap";
import { Tournament } from "../../types/Tournament";
import { useEffect, useState } from "react";
import { get } from "../../services/ApiService";
import { useParams } from "react-router";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import { useIsTournamentStaff } from "../../utils/auth";
import ManageEnrollments from "../../components/staff/ManageEnrollments";
import ManageDrops from "../../components/staff/ManageDrops";

const ManagePlayers = () => {
  const { tournamentId } = useParams();
  const user = useIsTournamentStaff(Number(tournamentId));
  const [tournament, setTournament] = useState<Tournament>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/enrollment`);
      const tourny = (await response.json()) as Tournament;
      setTournament(tourny);
    };
    fetchData();
  }, []);

  if (user && tournament) {
    return (
      <Container className="mt-3 my-md-4">
        <HelmetTitle titleText="Manage Players" />
        <Row>
          <BackButton
            buttonText="Back to tournament"
            path={`/tournament/${tournamentId}`}
          />
          <Col xs={12}>
            <h1 className="display-1">Manage players</h1>
          </Col>
        </Row>
        {tournament.status === "pending" && (
          <Col xs={12}>
            <ManageEnrollments tournamentId={Number(tournamentId)} />
          </Col>
        )}
        {tournament.status === "started" && (
          <>
            <Col xs={12}>
              <ManageDrops tournamentId={Number(tournamentId)} />
            </Col>
          </>
        )}
      </Container>
    );
  }
};

export default ManagePlayers;
