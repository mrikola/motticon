import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { get } from "../../services/ApiService";
import { TournamentsByType } from "../../types/Tournament";
import { Col, Container, Row, Button } from "react-bootstrap";
import * as dayjs from "dayjs";

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
    };
    fetchData();
  }, []);

  return (
    <Container className="mt-3 my-md-4">
      <Row>
        <h1 className="display-1">Tournaments</h1>
      </Row>
      <Row>
        {tournaments &&
          tournamentTypes.map((type, index) => {
            const tourneys = tournaments[type];
            return tourneys.length > 0 ? (
              <Col xs={12} key={index}>
                <h2 className="text-capitalize">{type} tournaments</h2>
                {tourneys.map((tournament) => (
                  <Row key={tournament.id} className="mt-3 my-md-4">
                    <Col xs={3}>
                      <p>{tournament.name}</p>
                    </Col>
                    <Col xs={3}>
                      <p>{tournament.description}</p>
                    </Col>
                    <Col xs={3}>
                      <p>
                        {dayjs(tournament.startDate).format("DD/MM/YYYY")} –{" "}
                        {dayjs(tournament.endDate).format("DD/MM/YYYY")}
                      </p>
                    </Col>
                    <Col xs={3}>
                      <Link to={`/tournament/${tournament.id}`}>
                        <Button variant="primary">Go to tournament</Button>
                      </Link>
                    </Col>
                  </Row>
                ))}
              </Col>
            ) : (
              <Col xs={12} key={index}>
                <h2 className="text-capitalize">No {type} tournaments</h2>
              </Col>
            );
          })}
      </Row>
      <Row></Row>
    </Container>
  );
}

export default Tournaments;
