import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { CardList } from "react-bootstrap-icons";

type Props = {
  tournamentId: number;
};

function GoToPods({ tournamentId }: Props) {
  return (
    <Row className="my-3">
      <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
        <Link
          to={`/tournament/${tournamentId}/pods/`}
          className="btn btn-primary btn-lg"
        >
          <div className="icon-link">
            <CardList className="fs-3" /> View my draft pods
          </div>
        </Link>
      </Col>
    </Row>
  );
}

export default GoToPods;
