import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Container, Button, Row } from "react-bootstrap";
import RoundOngoing from "../../components/tournament/RoundOngoing";
import DraftOngoing from "../../components/tournament/DraftOngoing";
import { BoxArrowInLeft } from "react-bootstrap-icons";
import { Draft, Match, Round, Tournament } from "../../types/Tournament";
import PendingView from "../../components/tournament/PendingView";

const Ongoing = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState<Tournament>();
  const user = useContext(UserInfoContext);
  // const [ongoingStatus, setOngoingStatus] = useState<string>();
  const [currentRound, setCurrentRound] = useState<Round>();
  const [currentDraft, setCurrentDraft] = useState<Draft>();
  const [currentMatch, setCurrentMatch] = useState<Match>();
  // const [roundStatus, setRoundStatus] = useState<string>();
  // const [draftStatus, setDraftStatus] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const [roundResponse, draftResponse] = await Promise.all([
        get(`/tournament/${tournamentId}/round`),
        get(`/tournament/${tournamentId}/draft`),
      ]);
      if (Number(roundResponse.headers.get("content-length")) > 0) {
        const round = (await roundResponse.json()) as Round;
        const roundParsed: Round = {
          ...round,
          startTime: new Date(round.startTime),
        };
        setCurrentRound(roundParsed);
        console.log(roundParsed);
      }

      if (Number(draftResponse.headers.get("content-length")) > 0) {
        const draft = (await draftResponse.json()) as Draft;
        setCurrentDraft(draft);
        // console.log(draft);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (!tournament) {
      const fetchData = async () => {
        const response = await get(`/tournament/${tournamentId}`);
        const tourny = (await response.json()) as Tournament;
        setTournament(tourny);
        // console.log(tourny);
      };
      if (user) {
        fetchData();
      }
    }
  }, [user]);

  useEffect(() => {
    if (!tournament) {
      const fetchData = async () => {
        const response = await get(
          `/tournament/${tournamentId}/round/${currentRound?.id}/match/${user?.id}`
        );
        const match = (await response.json()) as Match;
        setCurrentMatch(match);
      };
      if (user && currentRound) {
        fetchData();
      }
    }
  }, [currentRound]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await get(
  //       `/user/${user?.id}/tournament/${tournamentId}/current`
  //     );
  //     const { draft, round, match } = await response.json();
  //     setCurrentRound(round);
  //     setCurrentMatch(match);
  //     setCurrentDraft(draft);
  //     setDraftStatus(draft.status);
  //     setRoundStatus(round.status);
  //   };

  //   if (user) {
  //     fetchData();
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (roundStatus && draftStatus) {
  //     if (draftStatus == "pending" && roundStatus == "started") {
  //       setOngoingStatus("round");
  //     } else if (draftStatus == "started" && roundStatus == "pending") {
  //       setOngoingStatus("draft");
  //     } else {
  //       // error checking here
  //     }
  //   }
  // }, [currentRound, currentDraft, draftStatus, roundStatus]);

  // function changeOngoingStatus() {
  //   if (ongoingStatus === "round") {
  //     setOngoingStatus("draft");
  //   } else {
  //     setOngoingStatus("round");
  //   }
  // }

  if (user && tournament) {
    return (
      <Container className="mt-3 my-md-4">
        <Col xs={12}>
          <Link to={`/tournament/${tournamentId}`}>
            <Button variant="primary">
              <BoxArrowInLeft /> Back to tournament
            </Button>
          </Link>
        </Col>
        {tournament.status === "started" && (
          <>
            {currentRound && currentMatch && (
              <RoundOngoing
                tournament={tournament}
                round={currentRound}
                match={currentMatch}
              />
            )}
            {!currentRound && currentDraft && (
              <DraftOngoing draft={currentDraft} tournament={tournament} />
            )}
            {!currentRound && !currentDraft && (
              <>
                <PendingView tournamentId={Number(tournamentId)} />
              </>
            )}
          </>
        )}
        {tournament.status === "pending" && (
          <Row>
            <Col xs={12}>
              <h1 className="display-1">Tournament waiting to start.</h1>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
};

export default Ongoing;
