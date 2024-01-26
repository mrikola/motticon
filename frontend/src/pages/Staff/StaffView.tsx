import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { get, put } from "../../services/ApiService";
import { Col, Container, Row, Button } from "react-bootstrap";
import { BoxArrowInLeft } from "react-bootstrap-icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import { Draft, Round, Tournament } from "../../types/Tournament";
import { useIsTournamentStaff } from "../../utils/auth";
import Loading from "../../components/general/Loading";
import ManageRound from "../../components/staff/ManageRound";
import ManageDraft from "../../components/staff/ManageDraft";
import ManageEnrollments from "../../components/staff/ManageEnrollments";
import NextDraft from "../../components/staff/NextDraft";
import StandingsTable from "../../components/staff/StandingsTable";

function StaffView() {
  const { tournamentId } = useParams();
  const user = useIsTournamentStaff(Number(tournamentId));
  const [currentRound, setCurrentRound] = useState<Round>();
  const [currentDraft, setCurrentDraft] = useState<Draft>();
  const [tournament, setTournament] = useState<Tournament>();
  const [latestRoundNumber, setLatestRoundNumber] = useState<number>(0);

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
      }

      if (Number(draftResponse.headers.get("content-length")) > 0) {
        const draft = (await draftResponse.json()) as Draft;
        setCurrentDraft(draft);
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
      };
      if (user) {
        fetchData();
      }
    }
  }, [user]);

  const startTournament = async () => {
    const resp = await put(`/tournament/${tournamentId}/start`);
    const updatedTournament = (await resp.json()) as Tournament;
    setTournament({ ...tournament, ...updatedTournament });
  };

  // latestRoundNumber used for showing standings table
  useEffect(() => {
    if (currentRound) {
      setLatestRoundNumber(currentRound.roundNumber);
    } else if (tournament?.status === "completed") {
      const fetchData = async () => {
        const response = await get(`/tournament/${tournamentId}/round/recent`);
        const round = (await response.json()) as Round;
        setLatestRoundNumber(round.roundNumber);
      };

      fetchData();
    }
  }, [currentRound, tournament]);

  return user && tournament ? (
    <Container className="mt-3 my-md-4">
      <Col xs={12}>
        <Link to={`/tournament/${tournamentId}`}>
          <Button variant="primary" className="icon-link">
            <BoxArrowInLeft /> Back to tournament
          </Button>
        </Link>
      </Col>
      <Row>
        <h1 className="display-1">
          Hey {user.firstName} {user.lastName}
        </h1>
        <h1 className="display-1">{tournament.name}</h1>
      </Row>
      {tournament.status === "started" && (
        <>
          {currentRound && (
            <ManageRound
              currentRound={currentRound}
              setCurrentRound={setCurrentRound}
            />
          )}
          {!currentRound && currentDraft && (
            <ManageDraft
              currentDraft={currentDraft}
              setCurrentDraft={setCurrentDraft}
              setCurrentRound={setCurrentRound}
            />
          )}
          {!currentRound && !currentDraft && (
            <>
              <NextDraft
                tournamentId={Number(tournamentId)}
                setCurrentDraft={setCurrentDraft}
                updateTournament={setTournament}
              />
            </>
          )}
        </>
      )}
      {tournament.status === "pending" && (
        <>
          <ManageEnrollments tournamentId={Number(tournamentId)} />
          <Row>
            <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
              <Button
                variant="primary"
                className="btn-lg"
                onClick={() => startTournament()}
              >
                Start tournament
              </Button>
            </Col>
          </Row>
        </>
      )}
      {tournament.status === "completed" && (
        <Row>
          <Col xs={12}>
            <h3>The tournament is completed.</h3>
          </Col>
          <Col>
            <h3>Final standings.</h3>
            <StandingsTable roundNumber={latestRoundNumber} />
          </Col>
        </Row>
      )}
    </Container>
  ) : (
    <Loading />
  );
}
export default StaffView;
