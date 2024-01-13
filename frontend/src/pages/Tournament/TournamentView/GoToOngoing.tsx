import { Link } from "react-router-dom";
import { Col, Row, Button } from "react-bootstrap";
import { TrophyFill } from "react-bootstrap-icons";

type Props = {
  tournamentId: number;
};

function GoToOngoing({ tournamentId }: Props) {
  return (
    <Row>
      <Col xs={12}>
        <Link to={`/tournament/${tournamentId}/ongoing/`}>
          <Button variant="primary">
            <TrophyFill /> View ongoing
          </Button>
        </Link>
      </Col>
    </Row>
  );
}

export default GoToOngoing;
