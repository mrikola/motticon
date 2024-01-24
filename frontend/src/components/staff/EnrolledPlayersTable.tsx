import { Button, Table } from "react-bootstrap";
import { Enrollment, Player } from "../../types/User";
import { XLg } from "react-bootstrap-icons";
import { useEffect } from "react";

type Props = {
  enrollments: Enrollment[];
  buttonFunction: (player: Player) => void;
};

const EnrolledPlayersTable = ({ enrollments, buttonFunction }: Props) => {
  useEffect(() => {
    enrollments.sort((a, b) =>
      a.player.lastName.localeCompare(b.player.lastName)
    );
  }, [enrollments]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Player name</th>
          <th>Drop player</th>
        </tr>
      </thead>
      <tbody>
        {enrollments.map((enrollment) => (
          <tr key={enrollment.player.id}>
            <td>
              {enrollment.player.firstName} {enrollment.player.lastName}
            </td>
            <td>
              <Button
                variant="danger"
                onClick={() => buttonFunction(enrollment.player)}
              >
                <XLg /> Cancel enrollment
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default EnrolledPlayersTable;
