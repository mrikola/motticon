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
import Standings from "./TournamentView/Standings";
import Enroll from "./TournamentView/Enroll";
import GoToOngoing from "./TournamentView/GoToOngoing";
import Staff from "./TournamentView/Staff";

const TournamentView = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [activeTournament, setActiveTournament] = useState<Tournament>();
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [tournamentStatus, setTournamentStatus] = useState<string>();
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [staff, setStaff] = useState<boolean>(false);
  const [ongoingRound, setOngoingRound] = useState<Round>();
  const [freeSeats, setFreeSeats] = useState<number>();

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
      const { tournament, enrollment, preferences } = await response.json();
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
    };

    if (user) {
      fetchData();
    }
  }, [user, tournamentId]);

  // check if user is staff
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/user/${user?.id}/staff`);
      const staffed = (await response.json()) as Tournament[];
      staffed.map((tournament) => {
        if (tournament.id === Number(tournamentId)) {
          setStaff(true);
        }
      });
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/round`);
      const round = (await response.json()) as Round;
      setOngoingRound(round);
    };
    if (user && tournamentStatus === "ongoing") {
      fetchData();
    }
  }, [user]);

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
      <Row>
        <Col xs={12}>
          <Link to={`/tournaments`}>
            <Button variant="primary">
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
          <p>
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
          <Col xs={12}>
            <Link to={`/tournament/${activeTournament.id}/cubes/`}>
              <Button variant="primary">
                <Box /> View tournament cubes
              </Button>
            </Link>
          </Col>
        </Row>
      )}
      {isEnrolled && tournamentStatus === "ongoing" && (
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
      {staff && <Staff tournamentId={activeTournament.id} />}
      {tournamentStatus != "future" && (
        <Standings roundNumber={5} tournamentId={activeTournament.id} />
      )}
    </Container>
  ) : (
    <Loading />
  );
};

export default TournamentView;
