import { Table } from "react-bootstrap";
import { Match } from "../../types/Tournament";

type Props = {
  players: Match[];
};

const DecksSubmittedTable = ({ players }: Props) => {
  return (
    <>
      <h2>Deck building complete</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Table</th>
            <th>Player name</th>
            <th>Deck submitted</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.tableNumber}</td>
              <td>
                {player.player1.firstName} {player.player1.lastName}
              </td>
              <td>Yes</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>Deck building incomplete</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Table</th>
            <th>Player name</th>
            <th>Deck submitted</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.tableNumber}</td>
              <td>
                {player.player1.firstName} {player.player1.lastName}
              </td>
              <td>Yes</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default DecksSubmittedTable;
