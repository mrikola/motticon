import { Button, Col, Row, Table } from "react-bootstrap";
import { Match } from "../../types/Tournament";
import { useEffect, useState } from "react";

type Props = {
  matches: Match[];
  submitResultClicked: (match: Match) => void;
  roundTimerStarted: boolean;
};

const MatchTable = ({
  matches,
  submitResultClicked,
  roundTimerStarted,
}: Props) => {
  const [ongoingMatches, setOngoingMatches] = useState<Match[]>();
  const [doneMatches, setDoneMatches] = useState<Match[]>();

  useEffect(() => {
    setOngoingMatches(
      matches.filter((match) => match.resultSubmittedBy == null)
    );
    setDoneMatches(matches.filter((match) => match.resultSubmittedBy != null));
  }, [matches]);

  if (ongoingMatches && doneMatches) {
    return (
      <>
        <Row>
          <Col xs={12}>
            <h2>Ongoing matches</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Player 1</th>
                  <th>Player 2</th>
                  <th>Result</th>
                  <th>Staff result entry</th>
                </tr>
              </thead>
              <tbody>
                {ongoingMatches.map((match) => (
                  <tr key={match.id}>
                    <td>{match.tableNumber}</td>
                    <td>
                      {match.player1.firstName} {match.player1.lastName}
                    </td>
                    <td>
                      {match.player2.firstName} {match.player2.lastName}
                    </td>
                    <td>
                      {match.player1GamesWon} – {match.player2GamesWon}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        type="submit"
                        onClick={() => submitResultClicked(match)}
                        disabled={
                          match.resultSubmittedBy || !roundTimerStarted
                            ? true
                            : false
                        }
                        aria-disabled={
                          match.resultSubmittedBy || !roundTimerStarted
                            ? true
                            : false
                        }
                      >
                        Submit result
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
            <h2>Done matches</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Player 1</th>
                  <th>Player 2</th>
                  <th>Result</th>
                  <th>Staff result entry</th>
                </tr>
              </thead>
              <tbody>
                {doneMatches.map((match) => (
                  <tr key={match.id}>
                    <td>{match.tableNumber}</td>
                    <td>
                      {match.player1.firstName} {match.player1.lastName}
                    </td>
                    <td>
                      {match.player2.firstName} {match.player2.lastName}
                    </td>
                    <td>
                      {match.player1GamesWon} – {match.player2GamesWon}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        type="submit"
                        onClick={() => submitResultClicked(match)}
                        disabled={match.resultSubmittedBy ? true : false}
                        aria-disabled={match.resultSubmittedBy ? true : false}
                      >
                        Submit result
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

export default MatchTable;
