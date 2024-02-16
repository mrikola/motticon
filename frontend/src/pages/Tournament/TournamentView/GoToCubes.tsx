import { Col, Row } from "react-bootstrap";
import { Box } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

type Props = {
  tournamentId: number;
};

function GoToCubes({ tournamentId }: Props) {
  return (
    <Row>
      <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
        <Link
          to={`/tournament/${tournamentId}/cubes/`}
          className="btn btn-primary btn-lg"
        >
          <div className="icon-link">
            <Box className="fs-3" /> View cubes
          </div>
        </Link>
      </Col>
    </Row>
  );
}

export default GoToCubes;
