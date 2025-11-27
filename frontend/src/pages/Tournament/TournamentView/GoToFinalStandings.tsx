import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Trophy } from "react-bootstrap-icons";

type Props = {
  tournamentId: number;
};

function GoToFinalStandings({ tournamentId }: Props) {
  return (
    <Row className="my-3">
      <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
        <Link
          to={`/tournament/${tournamentId}/final-standings/`}
          className="btn btn-primary btn-lg"
        >
          <div className="icon-link">
            <Trophy className="fs-3" /> View Final Standings
          </div>
        </Link>
      </Col>
    </Row>
  );
}

export default GoToFinalStandings;

