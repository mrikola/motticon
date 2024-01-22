import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { get } from "../../services/ApiService";
import { TournamentsByType } from "../../types/Tournament";
import { Col, Container, Row, Button, Table, Card } from "react-bootstrap";
import * as dayjs from "dayjs";
import { Helmet, HelmetProvider } from "react-helmet-async";

function Tournaments() {
  const [tournaments, setTournaments] = useState<TournamentsByType>();
  const tournamentTypes: (keyof TournamentsByType)[] = [
    "ongoing",
    "future",
    "past",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await get("/tournaments");
      setTournaments((await response.json()) as TournamentsByType);
      tournaments?.future.sort((a, b) => (a.startDate > b.startDate ? -1 : 1));
    };
    fetchData();
  }, []);

  return (
    <>
      <Container className="mt-3 my-md-4">
        <HelmetProvider>
          <Helmet>
            <title>MottiCon &#9632; Tournaments</title>
          </Helmet>
        </HelmetProvider>
        <Row>
          <h1 className="display-1">Tournaments</h1>
        </Row>
        {tournaments &&
          tournamentTypes.map((type, index) => {
            const tourneys = tournaments[type];
            tourneys.sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
            return tourneys.length > 0 ? (
              <>
                <h2 className="text-capitalize mt-2">{type} tournaments</h2>
                <Row key={index} className="row-cols-1 row-cols-md-2 g-2">
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
                </Row>
              </>
            ) : (
              <Row>
                <Col xs={12} key={index}>
                  <h2 className="text-capitalize mt-2">
                    No {type} tournaments
                  </h2>
                </Col>
              </Row>
            );
          })}
      </Container>
    </>
  );
}

export default Tournaments;
