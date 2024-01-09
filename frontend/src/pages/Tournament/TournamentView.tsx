import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { get } from "../../services/ApiService";
import { Tournament } from "../../types/Tournament";
import { Cube } from "../../types/Cube";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Col, Container, Row, Button } from "react-bootstrap";
import {
  Box,
  BoxArrowInLeft,
  ListOl,
  CalendarDate,
  XLg,
} from "react-bootstrap-icons";
import dayjs from "dayjs";

const TournamentView = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [tournament, setTournament] = useState<Tournament>();
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [tournamentStatus, setTournamentStatus] = useState<string>();
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(
        `/user/${user?.id}/tournament/${tournamentId}`
      );
      // TODO types + view
      const { tournament, enrollment, preferences } = await response.json();
      sessionStorage.setItem("currentTournament", tournament.id);
      setTournament(tournament);
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
      if (enrollment && enrollment.id == tournamentId) {
        setIsEnrolled(true);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, tournamentId]);

  // get cubes for this tournament
  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/cubes`);
      const tournamentCubes = (await resp.json()) as Cube[];
      setCubes(tournamentCubes);
    };
    fetchData();
  }, [tournamentId]);

  function showStandings(roundNumber: number) {
    // todo: add generating of multiple standings based on data
    return (
      <Row>
        <Col xs={12}>
          <Link to={`/tournament/${tournamentId}/standings/${roundNumber}`}>
            <Button variant="primary">
              <ListOl /> Standings round {roundNumber}
            </Button>
          </Link>
        </Col>
      </Row>
    );
  }

  function showSignup() {
    // todo: add actual signup functionality
    return (
      <Row>
        <Col xs={12}>
          <h2>This is the signup functionality</h2>
        </Col>
      </Row>
    );
  }

  function showDrop() {
    // todo: add actual drop functionality
    return (
      <Row>
        <Col xs={12}>
          <Link to={`#`}>
            <Button variant="danger">
              <XLg /> Drop from tournament
            </Button>
          </Link>
        </Col>
      </Row>
    );
  }

  if (tournament) {
    return (
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
            <h1 className="display-1">{tournament.name}</h1>
            <h2>Status: {tournamentStatus}</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p>
              <CalendarDate /> Date:{" "}
              {dayjs(tournament.startDate).format("DD/MM/YYYY")} –{" "}
              {dayjs(tournament.endDate).format("DD/MM/YYYY")}
            </p>
            <p>{tournament.description}</p>
          </Col>
        </Row>
        {(() => {
          if (cubes.length > 0) {
            return (
              <Row>
                <Col xs={12}>
                  <Link to={`/tournament/${tournamentId}/cubes/`}>
                    <Button variant="primary">
                      <Box /> View tournament cubes
                    </Button>
                  </Link>
                </Col>
              </Row>
            );
          }
          return <></>;
        })()}
        {tournamentStatus == "future" && !isEnrolled ? showSignup() : <></>}
        {isEnrolled &&
        (tournamentStatus === "ongoing" || tournamentStatus === "future") ? (
          showDrop()
        ) : (
          <></>
        )}
        {tournamentStatus != "future" ? showStandings(5) : <></>}
      </Container>
    );
  } else {
    return <>no user lul</>;
  }
};

export default TournamentView;
