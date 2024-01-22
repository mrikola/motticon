import { useContext, useEffect, useState } from "react";
import { Badge, Card, Col, Container, Row } from "react-bootstrap";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { get } from "../../services/ApiService";
import { Tournament, UsersTournaments } from "../../types/Tournament";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import dayjs from "dayjs";

const Landing = () => {
  const [tournaments, setTournaments] = useState<UsersTournaments>();
  const [tournamentsStaffed, setTournamentsStaffed] = useState<Tournament[]>();
  const user = useContext(UserInfoContext);
  // const [tournamentsStaffedIds, setTournamentsStaffedIds] = useState<number[]>([
  //   1, 2,
  // ]);
  const [tournamentsStaffedIds, setTournamentsStaffedIds] =
    useState<number[]>();

  useEffect(() => {
    const fetchData = async () => {
      if (user && !tournaments) {
        const response = await get(`/user/${user?.id}/tournaments`);
        setTournaments((await response.json()) as UsersTournaments);
      }
    };

    fetchData();
  }, [user, tournaments]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && !tournamentsStaffed) {
        const response = await get(`/user/${user?.id}/staff`);
        setTournamentsStaffed(await response.json());
        // for tournamentsStaffed?.length > 0 ? {

        // }
      }
    };

    fetchData();
  }, [user, tournamentsStaffed]);

  useEffect(() => {
    if (!tournamentsStaffedIds && tournamentsStaffed) {
      const ids = [];
      for (const tournament in tournamentsStaffed) {
        ids.push(tournamentsStaffed[tournament].id);
      }
      setTournamentsStaffedIds(ids);
    }
  }, [tournamentsStaffed]);

  const tournamentTypes: (keyof UsersTournaments)[] = [
    "ongoing",
    "future",
    "past",
  ];

  return user && tournaments && tournamentsStaffedIds ? (
    <Container className="mt-3 my-md-4">
      <HelmetProvider>
        <Helmet>
          <title>MottiCon &#9632; Home</title>
        </Helmet>
      </HelmetProvider>
      <Col>
        <h1 className="display-1">
          Welcome, {user?.firstName} {user?.lastName}
        </h1>
        {tournaments &&
          tournamentTypes.map((type, index) => {
            const tourneys = tournaments[type];
            return tourneys.length > 0 ? (
              <>
                <h2 className="text-capitalize mt-2">
                  Your {type} tournaments
                </h2>
                <Row key={index} className="row-cols-1 row-cols-md-2 g-2"></Row>

                {tourneys.map((tournament) => {
                  let date;
                  if (
                    dayjs(tournament.startDate).isSame(
                      dayjs(tournament.endDate),
                      "day"
                    )
                  ) {
                    date = dayjs(tournament.startDate).format("DD/MM/YYYY");
                  } else {
                    date =
                      dayjs(tournament.startDate).format("DD/MM/YYYY") +
                      " - " +
                      dayjs(tournament.endDate).format("DD/MM/YYYY");
                  }
                  return (
                    <Col xs={12} md={6} lg={4} key={tournament.id}>
                      <Card>
                        <Card.Body>
                          <Card.Title>{tournament.name}</Card.Title>
                          <Card.Subtitle className="card-subtitle mb-2 text-body-secondary">
                            {date}
                          </Card.Subtitle>
                          <Card.Text>{tournament.description}</Card.Text>
                          <Link
                            to={`/tournament/${tournament.id}`}
                            className="btn btn-primary"
                          >
                            Go to tournament
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </>
            ) : (
              <h2 key={index}>No {type} tournaments</h2>
            );
          })}
      </Col>
    </Container>
  ) : (
    <Container>Loading...</Container>
  );
};

export default Landing;
