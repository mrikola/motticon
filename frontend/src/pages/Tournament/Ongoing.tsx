import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Container, Row } from "react-bootstrap";
import RoundOngoing from "../../components/tournament/RoundOngoing";
import DraftOngoing from "../../components/tournament/DraftOngoing";
import { Draft, Match, Round, Tournament } from "../../types/Tournament";
import PendingView from "../../components/tournament/PendingView";
import StandingsTable from "../../components/tournament/StandingsTable";
import BackButton from "../../components/general/BackButton";
import BetweenRounds from "../../components/tournament/BetweenRounds";
import LoadingOngoing from "../../components/general/LoadingOngoing";
import { Enrollment } from "../../types/User";
import { ApiClient, ApiException } from "../../services/ApiService";
import { startPolling } from "../../utils/polling";

const Ongoing = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [tournament, setTournament] = useState<Tournament>();
  const [currentRound, setCurrentRound] = useState<Round>();
  const [currentDraft, setCurrentDraft] = useState<Draft>();
  const [currentMatch, setCurrentMatch] = useState<Match>();
  const [latestRound, setLatestRound] = useState<Round>();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  if (!user) {
    return <LoadingOngoing />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [round, draft] = await Promise.all([
          ApiClient.getCurrentRound(Number(tournamentId)),
          ApiClient.getCurrentDraft(Number(tournamentId))
        ]);
        
        setCurrentRound(round);
        setCurrentDraft(draft);

        // Handle draft completion
        if (!draft && latestRound?.status === "completed" && 
            latestRound.roundNumber === currentDraft?.lastRound) {
          setCurrentDraft(undefined);
        }
      } catch (error) {
        if (error instanceof ApiException) {
          console.error('Failed to fetch round/draft:', error.message);
        }
      }
    };

    if (tournament?.status !== "completed") {
      return startPolling(() => fetchData());
    }
  }, [tournamentId, tournament, latestRound, currentDraft]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tourny = await ApiClient.getTournament(Number(tournamentId));
        setTournament(tourny);
      } catch (error) {
        if (error instanceof ApiException) {
          // TODO: Handle error properly
          console.error('Failed to fetch tournament:', error.message);
        }
      }
    };

    return startPolling(() => fetchData());
  }, [tournamentId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tourny = await ApiClient.getTournamentEnrollments(Number(tournamentId));
        setEnrollments(tourny.enrollments);
      } catch (error) {
        if (error instanceof ApiException) {
          console.error('Failed to fetch enrollments:', error.message);
        }
      }
    };

    return startPolling(() => fetchData());
  }, [tournamentId]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentRound && user?.id) {
        try {
          const match = await ApiClient.getPlayerMatch(
            Number(tournamentId),
            currentRound.id,
            user.id
          );
          setCurrentMatch(match);
        } catch (error) {
          if (error instanceof ApiException) {
            console.error('Failed to fetch match:', error.message);
          }
        }
      }
    };

    if (currentRound) {
      return startPolling(() => fetchData());
    }
  }, [currentRound, tournamentId, user]);

  // latestRoundNumber used for showing standings table
  useEffect(() => {
    const fetchData = async () => {
      try {
        const round = await ApiClient.getRecentRound(Number(tournamentId));
        setLatestRound(round);
      } catch (error) {
        if (error instanceof ApiException) {
          // TODO handle invalid response
          console.error('Failed to fetch recent round:', error.message);
        }
      }
    };

    return startPolling(() => fetchData());
  }, [currentRound, tournament, tournamentId]);

  if (tournament && enrollments) {
    return (
      <Container className="mt-3 my-md-4">
        <BackButton
          buttonText="Back to tournament"
          path={`/tournament/${tournamentId}`}
        />
        <Row>
          <Col xs={12}>
            <h1 className="display-1">{tournament.name}</h1>
          </Col>
        </Row>
        {tournament.status === "started" && (
          <>
            {currentRound && currentMatch && currentDraft && (
              <RoundOngoing
                tournament={tournament}
                enrollments={enrollments}
                draft={currentDraft}
                round={currentRound}
                match={currentMatch}
                setCurrentMatch={setCurrentMatch}
              />
            )}
            {!currentRound && currentDraft && (
              <>
                {latestRound &&
                latestRound.roundNumber >= currentDraft.firstRound ? (
                  <BetweenRounds
                    latestRoundNumber={latestRound.roundNumber}
                    lastRoundNumber={currentDraft.lastRound}
                    draft={currentDraft}
                    user={user}
                  />
                ) : (
                  <DraftOngoing
                    draft={currentDraft}
                    tournament={tournament}
                    setDraft={setCurrentDraft}
                  />
                )}
              </>
            )}
            {!currentRound && !currentDraft && (
              <PendingView tournamentId={Number(tournamentId)} />
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
                    user={user}
                  />
                </Col>
              </Row>
            )}
          </>
        )}
      </Container>
    );
  } else {
    <LoadingOngoing />;
  }
};

export default Ongoing;
