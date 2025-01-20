import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { get, put } from "../../services/ApiService";
import { Col, Container, Row, Button } from "react-bootstrap";
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
import StaffStandingsTable from "../../components/staff/StaffStandingsTable";
import BackButton from "../../components/general/BackButton";
import { toast } from "react-toastify";
import { Enrollment } from "../../types/User";
import { startPolling } from "../../utils/polling";

function StaffView() {
  const { tournamentId } = useParams();
  const user = useIsTournamentStaff(Number(tournamentId));
  const [currentRound, setCurrentRound] = useState<Round>();
  const [currentDraft, setCurrentDraft] = useState<Draft>();
  const [tournament, setTournament] = useState<Tournament>();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [latestRoundNumber, setLatestRoundNumber] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const [roundResponse, draftResponse] = await Promise.all([
        get(`/tournament/${tournamentId}/round`),
        get(`/tournament/${tournamentId}/draft`),
      ]);
      try {
        const round = (await roundResponse.json()) as Round;
        const roundParsed: Round = {
          ...round,
          startTime: new Date(round.startTime),
        };
        setCurrentRound(roundParsed);
      } catch {
        // TODO handle invalid response
      }

      try {
        const draft = (await draftResponse.json()) as Draft;
        setCurrentDraft(draft);
      } catch {
        // TODO handle invalid response
      }
    };

    if (user) {
      return startPolling(() => fetchData());
    }
  }, [tournamentId, user]);

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
      const response = await get(`/tournament/${tournamentId}/enrollment`);
      const tourny = (await response.json()) as Tournament;
      setEnrollments(tourny.enrollments);
    };

    if (user) {
      return startPolling(() => fetchData());
    }
  }, [tournamentId, user]);

  const startTournament = async () => {
    const resp = await put(`/tournament/${tournamentId}/start`);
    const updatedTournament = (await resp.json()) as Tournament;
    if (updatedTournament !== null) {
      toast.success("Tournament started");
      setTournament({ ...tournament, ...updatedTournament });
    }
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
      <Row>
        <BackButton
          buttonText="Back to tournament"
          path={`/tournament/${tournamentId}`}
        />
        <h1 className="display-1">{tournament.name}</h1>
        <h2 className="display-3">Staff View</h2>
      </Row>
      {tournament.status === "started" && (
        <>
          {currentRound && currentDraft && (
            <ManageRound
              currentRound={currentRound}
              currentDraft={currentDraft}
              enrollments={enrollments}
              setCurrentRound={setCurrentRound}
            />
          )}
          {!currentRound && currentDraft && (
            <ManageDraft
              currentDraft={currentDraft}
              enrollments={enrollments}
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
          <Row>
            <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
              <Button
                variant="info"
                className="btn-lg text-light"
                onClick={() => startTournament()}
              >
                Start tournament
              </Button>
            </Col>
          </Row>
          <ManageEnrollments tournamentId={Number(tournamentId)} />
        </>
      )}
      {tournament.status === "completed" && (
        <Row>
          <Col xs={12}>
            <h3>The tournament is completed.</h3>
          </Col>
          <Col>
            <h3>Final standings.</h3>
            <StaffStandingsTable roundNumber={latestRoundNumber} />
          </Col>
        </Row>
      )}
    </Container>
  ) : (
    <Loading />
  );
}
export default StaffView;
