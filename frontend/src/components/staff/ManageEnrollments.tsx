import { Col, Row } from "react-bootstrap";
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
  const [playersEnrolled, setPlayersEnrolled] = useState<number>();
  const [totalSeats, setTotalSeats] = useState<number>(0);

  function dropPlayer(player: Player) {
    const playerId = player.id;
    post(`/staff/tournament/${tournamentId}/cancel/${playerId}`, {}).then(
      async (resp) => {
        const tournament = await resp.json();
        if (tournament !== null) {
          console.log(tournament);
          setEnrollments(tournament.enrollments);
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
      setTotalSeats(tournament.totalSeats);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (enrollments) {
      setPlayersEnrolled(enrollments?.length);
    }
  }, [enrollments]);

  if (enrollments) {
    return (
      <>
        <Row className="mt-3">
          <h2>Manage tournament enrollment</h2>
        </Row>
        <Row>
          <Col xs={12}>
            <EnrollPlayers
              enrollments={enrollments}
              setEnrollments={setEnrollments}
              tournamentId={tournamentId}
              totalSeats={totalSeats}
            />
          </Col>
        </Row>
        <Row>
          <h2>
            {playersEnrolled}/{totalSeats} players enrolled:
          </h2>
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
