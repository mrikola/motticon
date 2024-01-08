import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { get } from "../../services/ApiService";
import { Tournament } from "../../types/Tournament";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Table, Col, Container, Row, Button } from "react-bootstrap";


const TournamentView = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [tournament, setTournament] = useState<Tournament>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(
        `/user/${user?.id}/tournament/${tournamentId}`
      );
      // TODO types + view
      const { tournament, enrollment, preferences } = await response.json();
      sessionStorage.setItem("currentTournament", tournament.id);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}`);
      const tourny = (await resp.json()) as Tournament;
      setTournament(tourny);
    };
    fetchData();
  }, []); 

  if (tournament) {
    return (
      <Container className="mt-3 my-md-4">
        <Col>
          <h1 className="display-1">
            {tournament.name}
          </h1>

        </Col>
      </Container>
    );
  } else {
    return <>no user lul</>;
  }
};

export default TournamentView;
