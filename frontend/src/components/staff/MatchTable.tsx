import { Button, Table } from "react-bootstrap";
import { Match } from "../../types/Tournament";

type Props = {
  matches: Match[];
  submitResultClicked: (match: Match) => void;
};

const MatchTable = ({ matches, submitResultClicked }: Props) => {
  if (matches) {
    return (
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
          {matches.map((match) => (
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
    );
  }
};

export default MatchTable;
