import { Col, Row } from "react-bootstrap";
import { Sliders2 } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

type Props = {
  tournamentId: number;
};

function ManagePreferences({ tournamentId }: Props) {
  return (
    <Row>
      <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
        <Link
          to={`/tournament/${tournamentId}/cubePreferences/`}
          className="btn btn-primary btn-lg"
        >
          <div className="icon-link">
            <Sliders2 className="fs-3" /> My cube preferences
          </div>
        </Link>
      </Col>
    </Row>
  );
}

export default ManagePreferences;
