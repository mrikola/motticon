import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { InfoCircleFill } from "react-bootstrap-icons";

type Props = {
  tournamentId: number;
  userId: number;
};

function GoToMatchHistory({ tournamentId, userId }: Props) {
  return (
    <Row className="my-3">
      <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
        <Link
          to={`/tournament/${tournamentId}/matches/${userId}`}
          className="btn btn-primary btn-lg"
        >
          <div className="icon-link">
            <InfoCircleFill className="fs-3" /> View my match history
          </div>
        </Link>
      </Col>
    </Row>
  );
}

export default GoToMatchHistory;
