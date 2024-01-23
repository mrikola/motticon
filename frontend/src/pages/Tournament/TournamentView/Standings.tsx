import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { ListOl } from "react-bootstrap-icons";

type Props = {
  roundNumber: number;
  tournamentId: number;
};

function Standings({ roundNumber, tournamentId }: Props) {
  // todo: add generating of multiple standings based on data
  return (
    <Row className="my-3">
      <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
        <Link
          to={`/tournament/${tournamentId}/standings/${roundNumber}`}
          className="btn btn-primary btn-lg"
        >
          <ListOl /> Standings round {roundNumber}
        </Link>
      </Col>
    </Row>
  );
}

export default Standings;
