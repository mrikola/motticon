import { Button, Col, Modal, Row } from "react-bootstrap";
import MatchResultRadioButtons from "./MatchResultRadioButtons";
import { useEffect, useState } from "react";
import { Match } from "../../types/Tournament";

export type ModalProps = {
  show: boolean;
  onHide: () => void;
  heading: string;
  actionFunction: (
    match: Match,
    player1GamesWon: string,
    player2GamesWon: string,
  ) => void;
  match: Match;
};

function ResultsInputModal({
  show,
  onHide,
  heading,
  actionFunction,
  match,
}: ModalProps) {
  const [playerRadioValue, setPlayerRadioValue] = useState<string>(
    match.player1GamesWon.toString(),
  );
  const [opponentRadioValue, setOpponentRadioValue] = useState<string>(
    match.player2GamesWon.toString(),
  );

  useEffect(() => {
    setPlayerRadioValue(match.player1GamesWon.toString());
    setOpponentRadioValue(match.player2GamesWon.toString());
  }, [show]);

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <MatchResultRadioButtons
            name={"player-radio"}
            value={playerRadioValue}
            updateFunction={setPlayerRadioValue}
            disabled={false}
            variant="info"
          />
          <Col xs={12} className="text-center">
            <h2>
              {match.player1.firstName} {match.player1.lastName}
            </h2>
          </Col>
          <Col xs={12} className="text-center">
            <h2>vs.</h2>
          </Col>
          <Col xs={12} className="text-center">
            <h2>
              {match.player2.firstName} {match.player2.lastName}
            </h2>
          </Col>
          <MatchResultRadioButtons
            name={"opponent-radio"}
            value={opponentRadioValue}
            updateFunction={setOpponentRadioValue}
            disabled={false}
            variant="info"
          />
          <div className="d-grid gap-2 my-3">
            <Button
              variant="info"
              className="btn-lg text-light"
              type="submit"
              disabled={playerRadioValue === opponentRadioValue}
              onClick={() =>
                actionFunction(match, playerRadioValue, opponentRadioValue)
              }
            >
              Submit result
            </Button>
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ResultsInputModal;
