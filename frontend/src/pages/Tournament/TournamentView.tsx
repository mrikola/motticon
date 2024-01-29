import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { get } from "../../services/ApiService";
import { Round, Tournament } from "../../types/Tournament";
import { Cube } from "../../types/Cube";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Container, Row, Button } from "react-bootstrap";
import { Box, BoxArrowInLeft, CalendarEvent } from "react-bootstrap-icons";
import dayjs from "dayjs";
import { Enrollment } from "../../types/User";
import Loading from "../../components/general/Loading";
import Standings from "./TournamentView/GoToStandings";
import Enroll from "./TournamentView/Enroll";
import GoToOngoing from "./TournamentView/GoToOngoing";
import Staff from "./TournamentView/GoToStaff";
import { Helmet, HelmetProvider } from "react-helmet-async";

const TournamentView = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [activeTournament, setActiveTournament] = useState<Tournament>();
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [tournamentStatus, setTournamentStatus] = useState<string>();
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [newestRoundNumber, setNewestRoundNumber] = useState<number>(0);
  const [freeSeats, setFreeSeats] = useState<number>(0);

  const isStaff =
    user?.isAdmin || user?.tournamentsStaffed.includes(Number(tournamentId));

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
      const now = dayjs();
      const tournyStartDate = dayjs(tournament.startDate);
      const tournyEndDate = dayjs(tournament.endDate);
      if (tournyEndDate.isBefore(now, "day")) {
        setTournamentStatus("past");
      } else if (tournyStartDate.isAfter(now, "day")) {
        setTournamentStatus("future");
      } else {
        setTournamentStatus("ongoing");
      }
      checkEnrolled(enrollment);
      //console.log(tournament);
    };

    if (user) {
      fetchData();
    }
  }, [user, tournamentId]);

  // if tournament if over, get the last round
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/round/recent`);
      const round = (await response.json()) as Round;

      setNewestRoundNumber(round.roundNumber);
    };
    if (user && activeTournament?.status === "completed") {
      fetchData();
    }
  }, [activeTournament]);

  // if tournament is ongoing, get ongoing round
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/round`);
      const round = (await response.json()) as Round;
      setNewestRoundNumber(round.roundNumber);
    };
    if (
      user &&
      tournamentStatus === "ongoing" &&
      activeTournament?.status !== "completed"
    ) {
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

  function freeSeatsUpdater(increase: number) {
    setFreeSeats(freeSeats + increase);
  }

  return activeTournament && user ? (
    <Container className="mt-3 my-md-4">
      <HelmetProvider>
        <Helmet>
          <title>MottiCon &#9632; {activeTournament.name}</title>
        </Helmet>
      </HelmetProvider>
      <Row>
        <Col xs={12}>
          <Link to={`/tournaments`}>
            <Button variant="primary" className="icon-link">
              <BoxArrowInLeft /> Back to tournaments
            </Button>
          </Link>
        </Col>
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
            <CalendarEvent className="display-6" />{" "}
            {dayjs(activeTournament.startDate).format("DD/MM/YYYY")} –{" "}
            {dayjs(activeTournament.endDate).format("DD/MM/YYYY")}
          </p>
          <p>{activeTournament.description}</p>
          <p>Type: Draft</p>
        </Col>
      </Row>
      {cubes.length > 0 && (
        <Row>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
            <Link
              to={`/tournament/${activeTournament.id}/cubes/`}
              className="btn btn-primary btn-lg"
            >
              <Box /> View cubes
            </Link>
          </Col>
        </Row>
      )}
      {isEnrolled &&
        tournamentStatus === "ongoing" &&
        (activeTournament.status === "started" ||
          activeTournament.status === "pending") && (
          <GoToOngoing tournamentId={activeTournament.id} />
        )}
      {tournamentStatus === "future" && (
        <Enroll
          isEnrolled={isEnrolled}
          userId={user?.id}
          enrolledChanger={setIsEnrolled}
          freeSeats={freeSeats}
          freeSeatsUpdater={freeSeatsUpdater}
          tournament={activeTournament}
        />
      )}
      {isStaff && <Staff tournamentId={activeTournament.id} />}
      {tournamentStatus != "future" && newestRoundNumber > 0 && (
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
