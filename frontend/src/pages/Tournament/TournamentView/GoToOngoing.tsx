import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { TrophyFill } from "react-bootstrap-icons";

type Props = {
  tournamentId: number;
};

function GoToOngoing({ tournamentId }: Props) {
  return (
    <Row className="my-3">
      <Col xs={12} className="d-grid">
        <Link
          to={`/tournament/${tournamentId}/ongoing/`}
          className="btn btn-primary"
        >
          <TrophyFill /> View ongoing
        </Link>
      </Col>
    </Row>
  );
}

export default GoToOngoing;
