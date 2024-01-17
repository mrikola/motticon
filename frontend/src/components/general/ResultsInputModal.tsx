import { Button, Col, Modal, Row } from "react-bootstrap";
import MatchResultRadioButtons from "./MatchResultRadioButtons";
import { useEffect, useState } from "react";
import { Match } from "../../types/Tournament";
import { Player } from "../../types/User";

export type ModalProps = {
  show: boolean;
  onHide: () => void;
  heading: string;
  actionFunction: () => void;
  actionText: string;
  match: Match;
};

function ResultsInputModal({
  show,
  onHide,
  heading,
  actionFunction,
  actionText,
  match,
}: ModalProps) {
  const [playerRadioValue, setPlayerRadioValue] = useState<string>(
    match.player1GamesWon.toString()
  );
  const [opponentRadioValue, setOpponentRadioValue] = useState<string>(
    match.player2GamesWon.toString()
  );

  // useEffect(() => {
  //   setPlayerRadioValue(match.player1GamesWon.toString());
  //   setOpponentRadioValue();
  // }, [match]);

  function handleModalSubmitClicked() {
    console.log("modal submit clicked");
  }

  function resetModal() {
    setPlayerRadioValue(match.player1GamesWon.toString());
    setOpponentRadioValue(match.player2GamesWon.toString());
  }

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <MatchResultRadioButtons
            name={"player-radio"}
            value={playerRadioValue}
            updateFunction={setPlayerRadioValue}
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
          />
          <div className="d-grid gap-2 my-3">
            <Button
              variant="primary"
              className="btn-lg"
              type="submit"
              onClick={() => handleModalSubmitClicked()}
            >
              Submit result
            </Button>
          </div>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant="danger">
          Back
        </Button>
        <Button onClick={resetModal}>Reset</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResultsInputModal;
