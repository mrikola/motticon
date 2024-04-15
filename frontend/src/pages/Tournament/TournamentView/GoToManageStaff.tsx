import { Col, Row } from "react-bootstrap";
import { GearFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

type Props = {
  tournamentId: number;
};

function GoToManageStaff({ tournamentId }: Props) {
  return (
    <Row className="my-3">
      <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
        <Link
          to={`/tournament/${tournamentId}/manage-staff`}
          className="btn-primary btn btn-lg"
        >
          <div className="icon-link">
            <GearFill className="fs-3" /> Manage staff
          </div>
        </Link>
      </Col>
    </Row>
  );
}

export default GoToManageStaff;
