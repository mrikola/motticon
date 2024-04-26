import { useEffect, useState } from "react";
import { Draft, DraftPodSeat } from "../../types/Tournament";
import { User } from "../../types/User";
import { Col, Row } from "react-bootstrap";
import { CheckSquare, CheckSquareFill } from "react-bootstrap-icons";
import DraftPoolButton from "../general/DraftPoolButton";

type Props = {
  latestRoundNumber: number;
  lastRoundNumber: number;
  draft: Draft;
  user: User;
};

function BetweenRounds({
  latestRoundNumber,
  lastRoundNumber,
  draft,
  user,
}: Props) {
  const [draftPodSeat, setDraftPodSeat] = useState<DraftPodSeat>();
  // get pod info from draft-object rather than having to do extra backend call
  useEffect(() => {
    if (user) {
      Object.values(draft.pods).forEach((pod) => {
        Object.values(pod.seats).forEach((seat) => {
          if (seat.player.id === user.id) {
            setDraftPodSeat(seat);
          }
        });
      });
    }
  }, [draft, user]);

  return (
    <>
      <Row>
        <Col xs={12}>
          <h3>Round {latestRoundNumber} done.</h3>
        </Col>
      </Row>
      {lastRoundNumber > latestRoundNumber && (
        <Row>
          <Col xs={12}>
            <h3>Waiting for round {latestRoundNumber + 1} to start.</h3>
          </Col>
        </Row>
      )}
      {draft.lastRound === latestRoundNumber && (
        <Row>
          <Col xs={12}>
            <h3>
              Draft {draft.draftNumber} done. Waiting for tournament organizer
              to complete draft.
            </h3>
            {draftPodSeat?.draftPoolReturned ? (
              <h3 className="icon-link">
                <CheckSquareFill className="text-success" /> You have returned
                your draft pool.
              </h3>
            ) : (
              <>
                <h3 className="icon-link">
                  <CheckSquare className="text-danger" /> Please return your
                  draft pool.
                </h3>
                {draftPodSeat && (
                  <Col xs={10} sm={8} className="d-grid gap-2 my-3 mx-auto">
                    <DraftPoolButton seat={draftPodSeat} />
                  </Col>
                )}
              </>
            )}
          </Col>
        </Row>
      )}
    </>
  );
}

export default BetweenRounds;
