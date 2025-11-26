import { Col, Row, Table } from "react-bootstrap";
import { DraftPod } from "../../types/Tournament";
import DraftPoolButton from "../general/DraftPoolButton";
import { User } from "../../types/User";

type Props = {
  pod: DraftPod;
  user: User;
  draftIndex: number;
};

function PodSeatsView({ pod, user, draftIndex }: Props) {
  return (
    <Row>
      <h2>Draft {draftIndex + 1}</h2>
      <h3>
        Pod {pod.podNumber}, {pod.cube?.title}
      </h3>
      {pod.seats
        .sort((a, b) => a.seat - b.seat)
        .map((seat) => (
          <div key={seat.id}>
            {user.id === seat.player?.id && seat.deckPhotoUrl ? (
              <Col
                xs={10}
                sm={8}
                className="d-grid gap-2 my-3 mx-auto"
                key={seat.id}
              >
                <DraftPoolButton seat={seat} />
              </Col>
            ) : (
              ""
            )}
          </div>
        ))}
      <Table striped borderless responsive>
        <thead>
          <tr>
            <th>Seat</th>
            <th>Player</th>
          </tr>
        </thead>
        <tbody>
          {pod.seats
            .sort((a, b) => a.seat - b.seat)
            .map((seat) => (
              <tr
                key={seat.id}
                className={
                  user.id === seat.player?.id ? "table-primary" : ""
                }
              >
                <td>{seat.seat}</td>
                <td className="td-no-wrap">
                  {seat.player?.firstName} {seat.player?.lastName}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Row>
  );
}

export default PodSeatsView;

