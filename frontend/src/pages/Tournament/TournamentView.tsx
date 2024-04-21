import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { get } from "../../services/ApiService";
import { Draft, Round, Tournament } from "../../types/Tournament";
import { Cube } from "../../types/Cube";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Container, Row } from "react-bootstrap";
import { CalendarEvent } from "react-bootstrap-icons";
import dayjs from "dayjs";
import { Enrollment } from "../../types/User";
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

const TournamentView = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [activeTournament, setActiveTournament] = useState<Tournament>();
  const [cubes, setCubes] = useState<Cube[]>([]);
  // const [tournamentStatus, setTournamentStatus] = useState<string>();
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [newestRoundNumber, setNewestRoundNumber] = useState<number>(0);
  const [freeSeats, setFreeSeats] = useState<number>(0);
  const [date, setDate] = useState<string>();
  const [_drafts, setDrafts] = useState<Draft[]>([]);
  const [pods, setPods] = useState<number>(0);

  const isStaff =
    user?.isAdmin || user?.tournamentsStaffed.includes(Number(tournamentId));

  const isAdmin = user?.isAdmin;

  function checkEnrolled(enrollment: Enrollment) {
    if (enrollment && enrollment.player.id === user?.id) {
      setIsEnrolled(true);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(
        `/user/${user?.id}/tournament/${tournamentId}`
      );
      const { tournament, enrollment } = await response.json();
      sessionStorage.setItem("currentTournament", tournament.id);
      setActiveTournament(tournament);
      setFreeSeats(tournament.totalSeats - tournament.enrollments.length);
      checkEnrolled(enrollment);
    };

    if (user) {
      fetchData();
    }
  }, [user, tournamentId]);

  // if tournament is over, get the last round
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/round/recent`);
      try {
        const round = (await response.json()) as Round;
        setNewestRoundNumber(round.roundNumber);
      } catch {
        // no recent round found
        setNewestRoundNumber(0);
      }
    };
    if (user && activeTournament?.status !== "pending") {
      fetchData();
    }
  }, [activeTournament]);

  // get cubes for this tournament
  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/cubes`);
      const tournamentCubes = (await resp.json()) as Cube[];
      setCubes(tournamentCubes);
    };
    fetchData();
  }, [tournamentId]);

  // get drafts for this tournament
  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/drafts`);
      const tournament = (await resp.json()) as Tournament;
      setDrafts(tournament.drafts);
      let p: number = 0;
      for (const draft of tournament.drafts) {
        if (draft.pods.length > 0) {
          p++;
        }
      }
      setPods(p);
    };
    fetchData();
  }, [tournamentId]);

  function freeSeatsUpdater(increase: number) {
    setFreeSeats(freeSeats + increase);
  }

  useEffect(() => {
    if (activeTournament) {
      if (
        dayjs(activeTournament.startDate).isSame(
          dayjs(activeTournament.endDate),
          "day"
        )
      ) {
        setDate(dayjs(activeTournament.startDate).format("DD/MM/YYYY"));
      } else {
        setDate(
          dayjs(activeTournament.startDate).format("DD/MM/YYYY") +
            " - " +
            dayjs(activeTournament.endDate).format("DD/MM/YYYY")
        );
      }
    }
  }, [activeTournament]);

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
            <CalendarEvent className="display-6" /> {date}
          </p>
          <p>{activeTournament.description}</p>
          <p>Type: Draft</p>
        </Col>
      </Row>
      {cubes.length > 0 && <GoToCubes tournamentId={activeTournament.id} />}
      {isAdmin && <GoToManageStaff tournamentId={activeTournament.id} />}
      {isStaff && <Staff tournamentId={activeTournament.id} />}
      {isEnrolled &&
        activeTournament.status === "pending" &&
        activeTournament.preferencesRequired > 0 && (
          <ManagePreferences tournamentId={activeTournament.id} />
        )}
      {isEnrolled && pods > 0 && (
        <GoToPods tournamentId={activeTournament.id} />
      )}
      {isEnrolled && activeTournament.status === "started" && (
        <GoToOngoing tournamentId={activeTournament.id} />
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
        <Standings
          roundNumber={newestRoundNumber}
          tournamentId={activeTournament.id}
        />
      )}
    </Container>
  ) : (
    <Loading />
  );
};

export default TournamentView;
