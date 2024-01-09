import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { get } from "../../services/ApiService";
import { Tournament } from "../../types/Tournament";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Container, Row, Button } from "react-bootstrap";
import RoundOngoing from "./RoundOngoing";
import DraftOngoing from "./DraftOngoing";
import { BoxArrowInLeft } from "react-bootstrap-icons";

const Ongoing = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [activeTournament, setActiveTournament] = useState<Tournament>();
  const [ongoingStatus, setOngoingStatus] = useState("round");

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(
        `/user/${user?.id}/tournament/${tournamentId}`
      );
      // TODO types + view
      const { tournament, enrollment, preferences } = await response.json();
      sessionStorage.setItem("currentTournament", tournament.id);
      setActiveTournament(tournament);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  function changeOngoingStatus() {
    if (ongoingStatus === "round") {
      setOngoingStatus("draft");
    } else {
      setOngoingStatus("round");
    }
  }

  if (activeTournament) {
    return (
      <Container className="mt-3 my-md-4">
        <Col xs={12}>
          <Button variant="danger" onClick={() => changeOngoingStatus()}>
            Change ongoing round status
          </Button>
        </Col>
        <Col xs={12}>
          <Link to={`/tournaments`}>
            <Button variant="primary">
              <BoxArrowInLeft /> Back to tournaments
            </Button>
          </Link>
        </Col>
        {ongoingStatus === "round" ? <RoundOngoing /> : <></>}
        {ongoingStatus === "draft" ? <DraftOngoing /> : <></>}
      </Container>
    );
  } else {
    return <>no user lul</>;
  }
};

export default Ongoing;
