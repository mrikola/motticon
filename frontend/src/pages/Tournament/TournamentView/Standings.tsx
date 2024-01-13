import { Link } from "react-router-dom";
import { Col, Row, Button } from "react-bootstrap";
import { ListOl } from "react-bootstrap-icons";

type Props = {
  roundNumber: number;
  tournamentId: number;
};

function Standings({ roundNumber, tournamentId }: Props) {
  // todo: add generating of multiple standings based on data
  return (
    <Row>
      <Col xs={12}>
        <Link to={`/tournament/${tournamentId}/standings/${roundNumber}`}>
          <Button variant="primary">
            <ListOl /> Standings round {roundNumber}
          </Button>
        </Link>
      </Col>
    </Row>
  );
}

export default Standings;
