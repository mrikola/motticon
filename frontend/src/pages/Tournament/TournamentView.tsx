import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { get } from "../../services/ApiService";
import { Tournament } from "../../types/Tournament";
import { Cube } from "../../types/Cube";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Table, Col, Container, Row, Button } from "react-bootstrap";
import { Box, BoxArrowInLeft, ListOl, CalendarDate, XLg } from "react-bootstrap-icons";
import * as dayjs from "dayjs";


const TournamentView = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [tournament, setTournament] = useState<Tournament>();
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [tournamentStatus, setTournamentStatus] = useState();
  const [isEnrolled, setIsEnrolled] = useState<Boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(
        `/user/${user?.id}/tournament/${tournamentId}`
      );
      // TODO types + view
      const { tournament, enrollment, preferences } = await response.json();
      sessionStorage.setItem("currentTournament", tournament.id);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // get tournament info and set relevant variables
  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}`);
      const tourny = (await resp.json()) as Tournament;
      setTournament(tourny);
      const now = dayjs();
      const tournyStartDate = dayjs(tourny.startDate);
      const tournyEndDate = dayjs(tourny.endDate);
      if(tournyEndDate.isBefore(now, 'day')) {
        setTournamentStatus('past')
      } else if(tournyStartDate.isAfter(now, 'day')) {
        setTournamentStatus('future');
      } else {
        setTournamentStatus('ongoing');
      }

    };
    fetchData();
  }, []); 

  // get cubes for this tournament
  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/cubes`);
      const tournamentCubes = (await resp.json()) as Cube[];
      setCubes(tournamentCubes);
    };
    fetchData();
  }, []);

  // get user tournaments and check if enrolled for this tournament
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const resp = await get(`/user/${user?.id}/tournament/${tournamentId}`);
        const tournamentInfo = (await resp.json()) as TournamentInfo;
        if(tournamentInfo.enrollment && (tournamentInfo.enrollment.id == tournamentId)) {
          setIsEnrolled(true);
        }
      }
    };
    fetchData();
  }, [user]);

  function showStandings() {
    // todo: add generating of multiple standings based on data
    return (
      <Row>
        <Col xs={12}>
            <Link to={`/tournament/${tournamentId}/standings/5`}>
            <Button variant="primary">
              <ListOl /> Standings round 5
            </Button>
          </Link>
        </Col>
      </Row>
    )
  }

  function showSignup() {
    // todo: add actual signup functionality
    return (
      <Row>
        <Col xs={12}>
          <h2>This is the signup functionality</h2>
        </Col>
      </Row>
    )
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
    )
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
            <h1 className="display-1">
              {tournament.name}
            </h1>
            <h2>Status: {tournamentStatus}</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p><CalendarDate /> Date: {dayjs(tournament.startDate).format('DD/MM/YYYY')} – {dayjs(tournament.endDate).format('DD/MM/YYYY')}</p>
            <p>{tournament.description}</p>
          </Col>
        </Row>
        {(() => {
          if(cubes.length > 0){
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
              )
          }
          return <></>;
        })()}
        { (tournamentStatus == 'future' && isEnrolled === false) ? showSignup() : <></> }
        { (tournamentStatus == 'future' && isEnrolled === true) ? showDrop() : <></> }
        { tournamentStatus != 'future' ? showStandings() : <></> }
      </Container>
    );
  } else {
    return <>no user lul</>;
  }
};

export default TournamentView;
