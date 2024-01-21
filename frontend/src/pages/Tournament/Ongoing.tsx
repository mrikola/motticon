import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Container, Button } from "react-bootstrap";
import RoundOngoing from "../../components/tournament/RoundOngoing";
import DraftOngoing from "../../components/tournament/DraftOngoing";
import { BoxArrowInLeft } from "react-bootstrap-icons";
import { Draft, Match, Round, Tournament } from "../../types/Tournament";

const Ongoing = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState<Tournament>();
  const user = useContext(UserInfoContext);
  const [ongoingStatus, setOngoingStatus] = useState<string>();
  const [currentRound, setCurrentRound] = useState<Round>();
  const [currentDraft, setCurrentDraft] = useState<Draft>();
  const [currentMatch, setCurrentMatch] = useState<Match>();
  const [roundStatus, setRoundStatus] = useState<string>();
  const [draftStatus, setDraftStatus] = useState<string>();

  useEffect(() => {
    if (!tournament) {
      const fetchData = async () => {
        const response = await get(`/tournament/${tournamentId}`);
        const tourny = (await response.json()) as Tournament;
        setTournament(tourny);
      };
      if (user) {
        fetchData();
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(
        `/user/${user?.id}/tournament/${tournamentId}/current`
      );
      const { draft, round, match } = await response.json();
      setCurrentRound(round);
      setCurrentMatch(match);
      setCurrentDraft(draft);
      setDraftStatus(draft.status);
      setRoundStatus(round.status);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (roundStatus && draftStatus) {
      if (draftStatus == "pending" && roundStatus == "started") {
        setOngoingStatus("round");
      } else if (draftStatus == "started" && roundStatus == "pending") {
        setOngoingStatus("draft");
      } else {
        // error checking here
      }
    }
  }, [currentRound, currentDraft, draftStatus, roundStatus]);

  function changeOngoingStatus() {
    if (ongoingStatus === "round") {
      setOngoingStatus("draft");
    } else {
      setOngoingStatus("round");
    }
  }
  if (tournament && ongoingStatus) {
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
          <RoundOngoing
            tournament={tournament}
            round={currentRound}
            match={currentMatch}
          />
        )}
        {currentDraft && ongoingStatus === "draft" && (
          <DraftOngoing draft={currentDraft} tournament={tournament} />
        )}
      </Container>
    );
  }
};

export default Ongoing;
