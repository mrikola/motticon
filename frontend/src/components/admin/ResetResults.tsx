import { useEffect } from "react";
import { Tournament } from "../../types/Tournament";
import { Button, Table } from "react-bootstrap";
import { post } from "../../services/ApiService";

type Props = {
  tournaments: Tournament[];
};

function ResetResults({ tournaments }: Props) {
  useEffect(() => {}, []);

  // get all ongoing tournaments

  // get current round for ongoing tournament

  function resetResultsForTournament(tournamentId: number) {
    post(`/admin/reset/tournament/${tournamentId}`, {}).then(async (resp) => {
      const reset = await resp.text();
      if (reset) {
        console.log("results reset");
      }
    });
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tournament name</th>
            <th>Reset results</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament, index) => (
            <tr key={index}>
              <td>{tournament.name}</td>
              <td>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => resetResultsForTournament(tournament.id)}
                >
                  Reset results
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default ResetResults;
