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
import StandingsTable from "../../components/tournament/StandingsTable";

const Ongoing = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState<Tournament>();
  const user = useContext(UserInfoContext);
  const [currentRound, setCurrentRound] = useState<Round>();
  const [currentDraft, setCurrentDraft] = useState<Draft>();
  const [currentMatch, setCurrentMatch] = useState<Match>();
  const [latestRound, setLatestRound] = useState<Round>();

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
  }, [tournamentId, user]);

  useEffect(() => {
    if (!tournament) {
      const fetchData = async () => {
        const response = await get(`/tournament/${tournamentId}`);
        const tourny = (await response.json()) as Tournament;
        setTournament(tourny);
        console.log(tourny);
      };
      if (user) {
        fetchData();
      }
    }
  }, [tournamentId, user]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentRound && !currentMatch) {
        const response = await get(
          `/tournament/${tournamentId}/round/${currentRound?.id}/match/${user?.id}`
        );
        const match = (await response.json()) as Match;
        setCurrentMatch(match);
      }
    };

    if (user && currentRound) {
      fetchData();
    }
  }, [currentRound]);

  // latestRoundNumber used for showing standings table
  useEffect(() => {
    if (currentRound) {
      setLatestRound(currentRound);
    } else {
      const fetchData = async () => {
        const response = await get(`/tournament/${tournamentId}/round/recent`);
        const round = (await response.json()) as Round;
        setLatestRound(round);
        console.log(round);
      };

      fetchData();
    }
  }, [currentRound, tournament]);

  if (user && tournament) {
    return (
      <Container className="mt-3 my-md-4">
        <Col xs={12}>
          <Link to={`/tournament/${tournamentId}`}>
            <Button variant="primary" className="icon-link">
              <BoxArrowInLeft />
              Back to tournament
            </Button>
          </Link>
        </Col>
        <Row>
          <Col xs={12}>
            <h1 className="display-1">{tournament.name}</h1>
          </Col>
        </Row>
        {tournament.status === "started" && (
          <>
            {currentRound && currentMatch && (
              <RoundOngoing
                tournament={tournament}
                round={currentRound}
                match={currentMatch}
                setCurrentMatch={setCurrentMatch}
              />
            )}
            {!currentRound && currentDraft && (
              <>
                {latestRound ? (
                  <h3>Round {latestRound.roundNumber} done.</h3>
                ) : (
                  <DraftOngoing draft={currentDraft} tournament={tournament} />
                )}
              </>
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
              <h2 className="">Tournament waiting to start.</h2>
            </Col>
          </Row>
        )}
        {tournament.status === "completed" && (
          <>
            <Row>
              <Col xs={12}>
                <h2 className="">Tournament completed.</h2>
              </Col>
            </Row>
            {latestRound && (
              <Row>
                <Col xs={12}>
                  <h3>Final standings.</h3>
                  <StandingsTable
                    roundNumber={latestRound?.roundNumber}
                    tournamentId={Number(tournamentId)}
                  />
                </Col>
              </Row>
            )}
          </>
        )}
      </Container>
    );
  }
};

export default Ongoing;
