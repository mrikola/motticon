import { Accordion, Button, Col, Row, Table } from "react-bootstrap";
import { Draft, DraftPod, DraftPodSeat } from "../../types/Tournament";
import { useEffect, useState } from "react";
import { CheckSquare, CheckSquareFill } from "react-bootstrap-icons";

type Props = {
  draft: Draft;
  pod: DraftPod;
  seats: DraftPodSeat[];
  markDoneClicked: (seat: DraftPodSeat) => void;
};

const PoolsReturnedTable = ({ draft, pod, seats, markDoneClicked }: Props) => {
  const [completeSeats, setCompleteSeats] = useState<DraftPodSeat[]>([]);
  const [incompleteSeats, setIncompleteSeats] = useState<DraftPodSeat[]>([]);

  useEffect(() => {
    setIncompleteSeats(seats.filter((seat) => seat.deckPhotoUrl === null));
    setCompleteSeats(seats.filter((seat) => seat.deckPhotoUrl !== null));
  }, [seats]);

  if (completeSeats && incompleteSeats) {
    return (
      <>
        <Accordion.Item eventKey={pod.id.toString()} key={pod.id}>
          <Accordion.Header>
            <h3>
              Draft {draft.draftNumber}, Pod {pod.podNumber},{" "}
              {completeSeats.length}/{seats.length} returned
            </h3>
          </Accordion.Header>
          <Accordion.Body className="px-0">
            <Row>
              <Col xs={12}>
                <h3>Pools missing</h3>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Seat</th>
                      <th>Player</th>
                      <th>Returned?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incompleteSeats.map((seat) => (
                      <tr key={seat.id}>
                        <td>{seat.seat}</td>
                        <td>
                          {seat.player.firstName} {seat.player.lastName}
                        </td>
                        <td>
                          {seat.deckPhotoUrl ? (
                            <CheckSquareFill
                              className="text-success fs-2"
                              onClick={() => markDoneClicked(seat)}
                            />
                          ) : (
                            <CheckSquare
                              className="text-danger fs-2"
                              onClick={() => markDoneClicked(seat)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h3>Pools returned</h3>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Seat</th>
                      <th>Player</th>
                      <th>Returned?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completeSeats.map((seat) => (
                      <tr key={seat.id}>
                        <td>{seat.seat}</td>
                        <td>
                          {seat.player.firstName} {seat.player.lastName}
                        </td>
                        <td className="text-center">
                          {seat.deckPhotoUrl ? (
                            <CheckSquareFill
                              className="text-success fs-2"
                              onClick={() => markDoneClicked(seat)}
                            />
                          ) : (
                            <CheckSquare
                              className="text-danger fs-2"
                              onClick={() => markDoneClicked(seat)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </>
    );
  }
};

export default PoolsReturnedTable;
