import { Button, Col, Row, Table } from "react-bootstrap";
import { DraftPodSeat } from "../../types/Tournament";
import { useEffect, useState } from "react";
import { CheckSquare, CheckSquareFill } from "react-bootstrap-icons";
import { Enrollment } from "../../types/User";
import { isPlayerDropped } from "../../utils/user";

type Props = {
  seats: DraftPodSeat[];
  enrollments: Enrollment[];
  markDoneClicked: (seat: DraftPodSeat) => void;
  draftTimerStarted: boolean;
};

const DraftTable = ({
  seats,
  enrollments,
  markDoneClicked,
  draftTimerStarted,
}: Props) => {
  const [completeSeats, setCompleteSeats] = useState<DraftPodSeat[]>([]);
  const [incompleteSeats, setIncompleteSeats] = useState<DraftPodSeat[]>([]);

  useEffect(() => {
    const sortedSeats = seats.sort(
      (a, b) => (a.pod?.podNumber ?? 0) - (b.pod?.podNumber ?? 0),
    );
    setIncompleteSeats(sortedSeats.filter((seat) => !seat.deckPhotoUrl));
    setCompleteSeats(sortedSeats.filter((seat) => !!seat.deckPhotoUrl));
  }, [seats]);

  if (completeSeats && incompleteSeats) {
    return (
      <>
        <Row>
          <Col xs={12}>
            <h2>Draft pool submission incomplete</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Player</th>
                  <th>Done?</th>
                  <th>Staff submission</th>
                </tr>
              </thead>
              <tbody>
                {incompleteSeats.map((seat) => (
                  <tr key={seat.id}>
                    <td>
                      {Math.round(
                        (((seat.pod?.podNumber ?? 1) - 1) * 8 + seat.seat) / 2,
                      )}
                    </td>
                    <td>
                      {seat.player?.firstName} {seat.player?.lastName}{" "}
                      {isPlayerDropped(enrollments, seat.player?.id ?? 0)
                        ? " DROPPED"
                        : ""}
                    </td>
                    <td>
                      {seat.deckPhotoUrl ? (
                        <CheckSquareFill className="text-success fs-2" />
                      ) : (
                        <CheckSquare className="text-danger fs-2" />
                      )}
                    </td>
                    <td>
                      <Button
                        variant="info"
                        className="btn text-light"
                        type="submit"
                        onClick={() => markDoneClicked(seat)}
                        disabled={
                          seat.deckPhotoUrl || !draftTimerStarted ? true : false
                        }
                        aria-disabled={
                          seat.deckPhotoUrl || !draftTimerStarted ? true : false
                        }
                      >
                        Mark done
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h2>Draft pool submission complete</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Player</th>
                  <th>Done?</th>
                  <th>Staff submission</th>
                </tr>
              </thead>
              <tbody>
                {completeSeats.map((seat) => (
                  <tr key={seat.id}>
                    <td>
                      {Math.round(
                        (((seat.pod?.podNumber ?? 1) - 1) * 8 + seat.seat) / 2,
                      )}
                    </td>
                    <td>
                      {seat.player?.firstName} {seat.player?.lastName}
                    </td>
                    <td className="text-center">
                      {seat.deckPhotoUrl ? (
                        <CheckSquareFill className="text-success fs-2" />
                      ) : (
                        <CheckSquare className="text-danger fs-2" />
                      )}
                    </td>
                    <td>
                      <Button
                        variant="info"
                        className="btn text-light"
                        type="submit"
                        onClick={() => markDoneClicked(seat)}
                        disabled={
                          seat.deckPhotoUrl || !draftTimerStarted ? true : false
                        }
                        aria-disabled={
                          seat.deckPhotoUrl || !draftTimerStarted ? true : false
                        }
                      >
                        Mark done
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </>
    );
  }
};

export default DraftTable;
