import { Col, Container, Row } from "react-bootstrap";
import { Tournament } from "../../types/Tournament";
import EnrollPlayers from "./EnrollPlayers";
import EnrolledPlayersTable from "./EnrolledPlayersTable";
import { Enrollment, Player } from "../../types/User";
import { useEffect, useState } from "react";
import { get, post } from "../../services/ApiService";

type Props = {
  tournamentId: number;
};

const ManageEnrollments = ({ tournamentId }: Props) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>();

  function dropPlayer(player: Player) {
    const playerId = player.id;
    post(`/staff/tournament/${tournamentId}/cancel/${playerId}`, {}).then(
      async (resp) => {
        const jwt = await resp.json();
        if (jwt !== null) {
          console.log(jwt);
          //const enrollments = tournament.enrollments as Enrollment[];
          //setEnrollments(enrollments);
          // freeSeatsUpdater(1);
        }
      }
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/enrollment`);
      const tournament = (await response.json()) as Tournament;
      const enrollments = tournament.enrollments;
      setEnrollments(enrollments);
    };
    fetchData();
  }, []);

  if (enrollments) {
    return (
      <>
        <Row className="mt-3">
          <h2>Manage tournament enrollment</h2>
        </Row>
        <Row>
          <Col xs={12}>
            <EnrollPlayers tournamentId={tournamentId} />
          </Col>
        </Row>
        <Row>
          <h2>{enrollments.length} enrolled players:</h2>
          <Col xs={12}>
            <EnrolledPlayersTable
              enrollments={enrollments}
              buttonFunction={dropPlayer}
            />
          </Col>
        </Row>
      </>
    );
  }
};

export default ManageEnrollments;
