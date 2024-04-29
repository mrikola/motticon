import { Button, Col, Row, Table } from "react-bootstrap";
import { Match } from "../../types/Tournament";
import { useEffect, useState } from "react";

type Props = {
  matches: Match[];
  submitResultClicked: (match: Match) => void;
  editResultClicked: (match: Match) => void;
  roundTimerStarted: boolean;
};

const MatchTable = ({
  matches,
  submitResultClicked,
  editResultClicked,
  roundTimerStarted,
}: Props) => {
  const [ongoingMatches, setOngoingMatches] = useState<Match[]>();
  const [doneMatches, setDoneMatches] = useState<Match[]>();

  useEffect(() => {
    setOngoingMatches(matches.filter((match) => !match.resultSubmittedBy));
    setDoneMatches(matches.filter((match) => match.resultSubmittedBy));
  }, [matches]);

  if (ongoingMatches && doneMatches) {
    return (
      <>
        <Row>
          <Col xs={12}>
            <h2>Ongoing matches</h2>
            <Table striped borderless hover>
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
                        variant="info"
                        className="text-light"
                        type="submit"
                        onClick={() => submitResultClicked(match)}
                        disabled={
                          !!match.resultSubmittedBy || !roundTimerStarted
                        }
                        aria-disabled={
                          !!match.resultSubmittedBy || !roundTimerStarted
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
            <Table striped borderless hover>
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Player 1</th>
                  <th>Player 2</th>
                  <th>Result</th>
                  <th>Staff result edit</th>
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
                        variant="danger"
                        type="submit"
                        onClick={() => editResultClicked(match)}
                        aria-disabled={match.resultSubmittedBy ? true : false}
                      >
                        Edit result
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
