import { Link } from "react-router-dom";
import { Col, Row, Button } from "react-bootstrap";
import { ListOl } from "react-bootstrap-icons";

type Props = {
  tournamentId: number;
};

function Staff({ tournamentId }: Props) {
  return (
    <Row className="my-3">
      <Col xs={12}>
        <Link to={`/tournament/${tournamentId}/staff`}>
          <Button variant="primary">
            <ListOl /> Go to staff view
          </Button>
        </Link>
      </Col>
    </Row>
  );
}

export default Staff;
