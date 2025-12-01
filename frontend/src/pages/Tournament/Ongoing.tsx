import { useContext, useState } from "react";
import { useParams } from "react-router";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Row } from "react-bootstrap";
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
import { usePolling } from "../../hooks/usePolling";
import PageContainer from "../../components/general/PageContainer";

const Ongoing = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [tournament, setTournament] = useState<Tournament>();
  const [currentRound, setCurrentRound] = useState<Round>();
  const [currentDraft, setCurrentDraft] = useState<Draft>();
  const [currentMatch, setCurrentMatch] = useState<Match>();
  const [latestRound, setLatestRound] = useState<Round>();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  usePolling(
    async () => {
      if (!user) return;
      try {
        const [round, draft] = await Promise.all([
          ApiClient.getCurrentRound(Number(tournamentId)),
          ApiClient.getCurrentDraft(Number(tournamentId)),
        ]);

        setCurrentRound(round);
        setCurrentDraft(draft);
      } catch (error) {
        if (error instanceof ApiException) {
          console.error("Failed to fetch round/draft:", error.message);
        }
      }
    },
    [tournamentId, user],
    { enabled: !!user && tournament?.status !== "completed" }
  );

  usePolling(
    async () => {
      if (!user) return;
      try {
        const tourny = await ApiClient.getTournament(Number(tournamentId));
        setTournament(tourny);
      } catch (error) {
        if (error instanceof ApiException) {
          // TODO: Handle error properly
          console.error("Failed to fetch tournament:", error.message);
        }
      }
    },
    [tournamentId, user],
    { enabled: !!user }
  );

  usePolling(
    async () => {
      if (!user) return;
      try {
        const tourny = await ApiClient.getTournamentEnrollments(
          Number(tournamentId)
        );
        setEnrollments(tourny.enrollments);
      } catch (error) {
        if (error instanceof ApiException) {
          console.error("Failed to fetch enrollments:", error.message);
        }
      }
    },
    [tournamentId, user],
    { enabled: !!user }
  );

  usePolling(
    async () => {
      if (!user || !currentRound || !user.id) return;
      try {
        const match = await ApiClient.getPlayerMatch(
          Number(tournamentId),
          currentRound.id,
          user.id
        );
        setCurrentMatch(match);
      } catch (error) {
        if (error instanceof ApiException) {
          console.error("Failed to fetch match:", error.message);
        }
      }
    },
    [currentRound, tournamentId, user],
    { enabled: !!user && !!currentRound }
  );

  // latestRoundNumber used for showing standings table
  usePolling(
    async () => {
      if (!user) return;
      try {
        const round = await ApiClient.getRecentRound(Number(tournamentId));
        setLatestRound(round);
      } catch (error) {
        if (error instanceof ApiException) {
          // TODO handle invalid response
          console.error("Failed to fetch recent round:", error.message);
        }
      }
    },
    [tournamentId, user],
    { enabled: !!user }
  );

  if (user && tournament && enrollments) {
    return (
      <PageContainer>
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
      </PageContainer>
    );
  } else {
    return <LoadingOngoing />;
  }
};

export default Ongoing;
