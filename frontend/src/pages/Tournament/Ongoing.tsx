import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Container, Button } from "react-bootstrap";
import RoundOngoing from "../../components/tournament/RoundOngoing";
import DraftOngoing from "../../components/tournament/DraftOngoing";
import { BoxArrowInLeft } from "react-bootstrap-icons";
import { Draft, Match, Round } from "../../types/Tournament";

const Ongoing = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [ongoingStatus, setOngoingStatus] = useState("round");
  const [currentRound, setCurrentRound] = useState<Round>();
  const [currentDraft, setCurrentDraft] = useState<Draft>();
  const [currentMatch, setCurrentMatch] = useState<Match>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(
        `/user/${user?.id}/tournament/${tournamentId}/current`
      );
      const { draft, round, match } = await response.json();
      setCurrentRound(round);
      setCurrentMatch(match);
      setCurrentDraft(draft);
      // console.log("draft", JSON.stringify(draft));
      console.log("round", JSON.stringify(round));
      // console.log("match", JSON.stringify(match));
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/round`);
      const testRound = (await response.json()) as Round;
      console.log("round", JSON.stringify(testRound));
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

  return (
    <Container className="mt-3 my-md-4">
      <Col xs={12}>
        <Button variant="danger" onClick={() => changeOngoingStatus()}>
          Change ongoing round status (TEST)
        </Button>
      </Col>
      <Col xs={12}>
        <Link to={`/tournament/${tournamentId}`}>
          <Button variant="primary">
            <BoxArrowInLeft /> Back to tournament
          </Button>
        </Link>
      </Col>
      {currentRound && currentMatch && ongoingStatus === "round" && (
        <RoundOngoing round={currentRound} match={currentMatch} />
      )}
      {currentDraft && ongoingStatus === "draft" && (
        <DraftOngoing draft={currentDraft} />
      )}
    </Container>
  );
};

export default Ongoing;
