import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router";
import { ApiClient, ApiException } from "../../services/ApiService";
import { Tournament } from "../../types/Tournament";
import { Cube } from "../../types/Cube";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Container, Row } from "react-bootstrap";
import { CalendarEvent } from "react-bootstrap-icons";
import { formatTournamentDate } from "../../utils/dateUtils";
import {
  isUserTournamentStaff,
  calculateFreeSeats,
  hasPreferencesRequired,
} from "../../utils/tournamentUtils";
import Loading from "../../components/general/Loading";
import Standings from "./TournamentView/GoToStandings";
import Enroll from "./TournamentView/Enroll";
import GoToOngoing from "./TournamentView/GoToOngoing";
import Staff from "./TournamentView/GoToStaff";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import GoToCubes from "./TournamentView/GoToCubes";
import ManagePreferences from "./TournamentView/ManagePreferences";
import GoToPods from "./TournamentView/GoToPods";
import GoToManageStaff from "./TournamentView/GoToManageStaff";
import { toast } from "react-toastify";
import { Enrollment } from "../../types/User";
import GoToMatchHistory from "./TournamentView/GoToMatchHistory";

const TournamentView = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [activeTournament, setActiveTournament] = useState<Tournament>();
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [newestRoundNumber, setNewestRoundNumber] = useState<number>(0);
  const [freeSeats, setFreeSeats] = useState<number>(0);
  const [numberOfPods, setNumberOfPods] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const isStaff = useMemo(
    () =>
      user && tournamentId
        ? isUserTournamentStaff(user, Number(tournamentId))
        : false,
    [user, tournamentId]
  );

  const isAdmin = user?.isAdmin;

  const formattedDate = useMemo(
    () =>
      activeTournament
        ? formatTournamentDate(
            activeTournament.startDate,
            activeTournament.endDate
          )
        : "",
    [activeTournament]
  );

  const checkEnrolled = useCallback(
    (enrollment: Enrollment | null) => {
      if (enrollment && enrollment.player?.id === user?.id) {
        setIsEnrolled(true);
      }
    },
    [user?.id]
  );

  const freeSeatsUpdater = useCallback((increase: number) => {
    setFreeSeats((prev) => prev + increase);
  }, []);

  const fetchAllTournamentData = useCallback(async () => {
    if (!user?.id || !tournamentId) return;

    const parsedTournamentId = Number(tournamentId);
    if (isNaN(parsedTournamentId)) {
      setError("Invalid tournament ID");
      return;
    }

    try {
      const [tournamentInfo, cubes, pods] = await Promise.all([
        ApiClient.getTournamentInfo(user.id, parsedTournamentId),
        ApiClient.getCubes(parsedTournamentId),
        ApiClient.getPods(parsedTournamentId),
      ]);

      // Set tournament data and derived states
      setActiveTournament(tournamentInfo.tournament);
      setCubes(cubes);
      setFreeSeats(calculateFreeSeats(tournamentInfo.tournament));
      setNumberOfPods(
        (pods.drafts ?? []).filter((draft) => draft.pods.length > 0).length
      );
      checkEnrolled(tournamentInfo.enrollment ?? null);

      // Store tournament ID
      sessionStorage.setItem(
        "currentTournament",
        tournamentInfo.tournament.id.toString()
      );

      // Fetch round data if tournament is not pending
      if (tournamentInfo.tournament.status !== "pending") {
        try {
          const round = await ApiClient.getRecentRound(parsedTournamentId);
          setNewestRoundNumber(round?.roundNumber ?? 0);
        } catch (error) {
          if (error instanceof ApiException && error.type !== "notFound") {
            toast.error("Failed to load recent round data");
          }
          setNewestRoundNumber(0);
        }
      }
    } catch (error) {
      if (error instanceof ApiException) {
        switch (error.type) {
          case "notFound":
            setError("Tournament not found");
            break;
          case "auth":
            setError("You do not have permission to view this tournament");
            break;
          default:
            setError("Failed to load tournament data");
        }
        toast.error(error.message);
      }
    }
  }, [user?.id, tournamentId]);

  useEffect(() => {
    if (user) {
      fetchAllTournamentData();
    }
  }, [user, fetchAllTournamentData]);

  if (error) {
    return (
      <Container className="mt-3 my-md-4">
        <Row>
          <Col>
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <BackButton buttonText="Back to tournaments" path="/tournaments" />
          </Col>
        </Row>
      </Container>
    );
  }

  return activeTournament && user ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText={activeTournament.name} />
      <Row>
        <BackButton buttonText="Back to tournaments" path="/tournaments" />
        <Col xs={12}>
          <h1 className="display-1">{activeTournament.name}</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h2>Tournament info</h2>
        </Col>
        <Col xs={12}>
          <p className="icon-link">
            <CalendarEvent className="display-6" /> {formattedDate}
          </p>
          <p>{activeTournament.description}</p>
          <p>Type: Draft</p>
        </Col>
      </Row>
      {isAdmin && <GoToManageStaff tournamentId={activeTournament.id} />}
      {isStaff && (
        <>
          <Staff tournamentId={activeTournament.id} />
          <hr />
        </>
      )}
      {isEnrolled && activeTournament.status === "started" && (
        <>
          <GoToOngoing tournamentId={activeTournament.id} />
          <hr />
        </>
      )}
      {cubes.length > 0 && <GoToCubes tournamentId={activeTournament.id} />}

      {isEnrolled && hasPreferencesRequired(activeTournament) && (
        <ManagePreferences tournamentId={activeTournament.id} />
      )}
      {isEnrolled && numberOfPods > 0 && (
        <GoToPods tournamentId={activeTournament.id} />
      )}
      {isEnrolled &&
        activeTournament.status !== "pending" &&
        newestRoundNumber > 0 && (
          <GoToMatchHistory
            tournamentId={activeTournament.id}
            userId={user?.id}
          />
        )}

      {activeTournament.status === "pending" && (
        <Enroll
          isEnrolled={isEnrolled}
          userId={user?.id}
          enrolledChanger={setIsEnrolled}
          freeSeats={freeSeats}
          freeSeatsUpdater={freeSeatsUpdater}
          tournament={activeTournament}
          userEnrollmentEnabled={activeTournament.userEnrollmentEnabled}
        />
      )}
      {activeTournament.status !== "pending" && newestRoundNumber > 0 && (
        <>
          <hr />
          <Standings
            roundNumber={newestRoundNumber}
            tournamentId={activeTournament.id}
          />
        </>
      )}
    </Container>
  ) : (
    <Loading />
  );
};

export default TournamentView;
