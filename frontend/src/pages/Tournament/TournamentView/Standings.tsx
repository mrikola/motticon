import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { ListOl } from "react-bootstrap-icons";
import { useState } from "react";

type Props = {
  roundNumber: number;
  tournamentId: number;
};

function Standings({ roundNumber, tournamentId }: Props) {
  const [rounds, setRounds] = useState<number[]>([]);

  if (rounds.length === 0) {
    const rnd = [];
    for (let i = 1; i <= roundNumber; i++) {
      rnd.push(i);
    }
    rnd.sort((a, b) => (a > b ? -1 : 1));
    setRounds(rnd);
  }

  return (
    <Row className="my-3">
      <h2>
        <ListOl /> Standings
      </h2>
      <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
        {rounds.map((round: number) => {
          return (
            <Link
              to={`/tournament/${tournamentId}/standings/${round}`}
              className="btn btn-primary"
              key={round}
            >
              Standings round {round}
            </Link>
          );
        })}
      </Col>
    </Row>
  );
}

export default Standings;
