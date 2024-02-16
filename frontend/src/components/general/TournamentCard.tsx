import { Badge, Card, Col } from "react-bootstrap";
import { Tournament, UsersTournaments } from "../../types/Tournament";
import { Link } from "react-router-dom";
import { CheckCircleFill } from "react-bootstrap-icons";

type Props = {
  tournament: Tournament;
  staffedIds: number[];
  enrolledIds: number[];
  date: string;
};

function TournamentCard({ tournament, staffedIds, enrolledIds, date }: Props) {
  return (
    <Col xs={12} md={6} lg={4}>
      <Card>
        <Card.Body>
          <Card.Title>
            {tournament.name}{" "}
            {staffedIds.includes(tournament.id) && (
              <Badge bg="primary" text="dark">
                Staff
              </Badge>
            )}
            {enrolledIds.includes(tournament.id) && (
              <>
                {tournament.status === "completed" ? (
                  <Badge bg="primary" text="dark" className="icon-link" pill>
                    <CheckCircleFill /> Played in
                  </Badge>
                ) : (
                  <Badge bg="primary" text="dark" className="icon-link" pill>
                    <CheckCircleFill /> Enrolled
                  </Badge>
                )}
              </>
            )}
          </Card.Title>
          <Card.Subtitle className="card-subtitle mb-2 text-body-secondary">
            {date}
          </Card.Subtitle>
          <Card.Text>{tournament.description}</Card.Text>
          <Link to={`/tournament/${tournament.id}`} className="btn btn-primary">
            Go to tournament
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default TournamentCard;
