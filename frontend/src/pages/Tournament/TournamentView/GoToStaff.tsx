import { Col, Row } from "react-bootstrap";
import { ListOl } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

type Props = {
  tournamentId: number;
};

function Staff({ tournamentId }: Props) {
  return (
    <Row className="my-3">
      <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
        <Link
          to={`/tournament/${tournamentId}/staff`}
          className="btn-primary btn btn-lg"
        >
          <ListOl /> Go to staff view
        </Link>
      </Col>
    </Row>
  );
}

export default Staff;
