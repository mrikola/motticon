import { Col, Row, Button } from "react-bootstrap";
import { ListOl } from "react-bootstrap-icons";

type Props = {
  tournamentId: number;
};

function Staff({ tournamentId }: Props) {
  return (
    <Row className="my-3">
      <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
        <Button
          variant="primary"
          className="btn-lg"
          href={`/tournament/${tournamentId}/staff`}
        >
          <ListOl /> Go to staff view
        </Button>
      </Col>
    </Row>
  );
}

export default Staff;
