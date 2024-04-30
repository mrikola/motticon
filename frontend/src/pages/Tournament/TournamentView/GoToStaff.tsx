import { Col, Row } from "react-bootstrap";
import { CardImage, ListOl, PeopleFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

type Props = {
  tournamentId: number;
};

function Staff({ tournamentId }: Props) {
  return (
    <>
      <Row className="my-3">
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
          <Link
            to={`/tournament/${tournamentId}/staff`}
            className="btn-info btn btn-lg"
          >
            <div className="icon-link text-light">
              <ListOl className="fs-3" /> Go to staff view
            </div>
          </Link>
        </Col>
      </Row>
      <Row className="my-3">
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
          <Link
            to={`/tournament/${tournamentId}/pools`}
            className="btn-info btn btn-lg"
          >
            <div className="icon-link text-light">
              <CardImage className="fs-3" /> View all draft pools
            </div>
          </Link>
        </Col>
      </Row>
      <Row className="my-3">
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
          <Link
            to={`/tournament/${tournamentId}/players`}
            className="btn-info btn btn-lg"
          >
            <div className="icon-link text-light">
              <PeopleFill className="fs-3" /> Manage players
            </div>
          </Link>
        </Col>
      </Row>
    </>
  );
}

export default Staff;
