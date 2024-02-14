import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { TrophyFill } from "react-bootstrap-icons";

type Props = {
  tournamentId: number;
};

function GoToOngoing({ tournamentId }: Props) {
  return (
    <Row className="my-3">
      <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
        <Link
          to={`/tournament/${tournamentId}/ongoing/`}
          className="btn btn-primary btn-lg"
        >
          <div className="icon-link">
            <TrophyFill className="fs-3" /> View ongoing
          </div>
        </Link>
      </Col>
    </Row>
  );
}

export default GoToOngoing;
