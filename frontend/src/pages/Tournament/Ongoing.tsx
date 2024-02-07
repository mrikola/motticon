import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Container, Row } from "react-bootstrap";
import RoundOngoing from "../../components/tournament/RoundOngoing";
import DraftOngoing from "../../components/tournament/DraftOngoing";
import { Draft, Match, Round, Tournament } from "../../types/Tournament";
import PendingView from "../../components/tournament/PendingView";
import StandingsTable from "../../components/tournament/StandingsTable";
import BackButton from "../../components/general/BackButton";
import BetweenRounds from "../../components/tournament/BetweenRounds";

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
      console.log("B call: tournament/id/round");
      console.log("B call: tournament/id/draft");
      try {
        const round = (await roundResponse.json()) as Round;
        const roundParsed: Round = {
          ...round,
          startTime: new Date(round.startTime),
        };
        setCurrentRound(roundParsed);
        console.log(roundParsed);
      } catch {
        // TODO handle invalid response
        // set current round as null when inbetween rounds
        setCurrentRound(undefined);
      }

      try {
        const draft = (await draftResponse.json()) as Draft;
        setCurrentDraft(draft);
        console.log(draft);
      } catch {
        // TODO handle invalid response
      }
    };
    const doFetch = () => {
      if (user && tournament?.status !== "completed") {
        fetchData();
      }
    };

    doFetch();
    const roundInterval = setInterval(doFetch, 10000);

    // return destructor function from useEffect to clear the interval pinging
    return () => {
      clearInterval(roundInterval);
    };
  }, [tournamentId, user, tournament]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}`);
      const tourny = (await response.json()) as Tournament;
      console.log("B call: tournament/id");
      setTournament(tourny);
      // console.log(tourny);
    };

    const doFetch = () => {
      if (user) {
        fetchData();
      }
    };

    doFetch();
    const roundInterval = setInterval(doFetch, 10000);

    // return destructor function from useEffect to clear the interval pinging
    return () => {
      clearInterval(roundInterval);
    };
  }, [tournamentId, user]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentRound) {
        const response = await get(
          `/tournament/${tournamentId}/round/${currentRound?.id}/match/${user?.id}`
        );
        const match = (await response.json()) as Match;
        console.log("B call: tournament/id/round/number/match/userID");
        setCurrentMatch(match);
        // console.log(match);
      }
    };

    const doFetch = () => {
      if (user && currentRound) {
        fetchData();
      }
    };

    doFetch();
    const roundInterval = setInterval(doFetch, 10000);

    // return destructor function from useEffect to clear the interval pinging
    return () => {
      clearInterval(roundInterval);
    };
  }, [currentRound, tournamentId, user]);

  // latestRoundNumber used for showing standings table
  useEffect(() => {
    // if (currentRound) {
    //   setLatestRound(currentRound);
    // } else {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/round/recent`);

      console.log("B call: tournament/id/round/recent");
      try {
        const round = (await response.json()) as Round;
        setLatestRound(round);
        console.log(round);
      } catch {
        // TODO handle invalid response
      }

      // const round = (await response.json()) as Round;
      // console.log("B call: tournament/id/round/recent");
    };
    const doFetch = () => {
      if (user) {
        fetchData();
      }
    };

    doFetch();
    const roundInterval = setInterval(doFetch, 10000);

    // return destructor function from useEffect to clear the interval pinging
    return () => {
      clearInterval(roundInterval);
    };
  }, [currentRound, tournament, tournamentId]);

  if (user && tournament) {
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
                  <BetweenRounds
                    latestRoundNumber={latestRound.roundNumber}
                    lastRoundNumber={currentDraft.lastRound}
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
