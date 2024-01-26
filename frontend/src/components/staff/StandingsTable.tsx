import { Table } from "react-bootstrap";
import { ScoreHistory } from "../../types/Tournament";
import { useEffect, useState } from "react";
import { get } from "../../services/ApiService";
import { useParams } from "react-router";

type Props = {
  roundNumber: number;
};

const StandingsTable = ({ roundNumber }: Props) => {
  const { tournamentId } = useParams();
  const [standings, setStandings] = useState<ScoreHistory[]>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(
        `/tournament/${tournamentId}/standings/${roundNumber}`
      );
      const roundStandings = (await response.json()) as ScoreHistory[];
      roundStandings.sort((a, b) => (a.points > b.points ? -1 : 1));
      setStandings(roundStandings);
    };
    fetchData();
  }, [roundNumber, tournamentId]);

  if (standings) {
    return (
      <Table striped borderless responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Match points</th>
            <th>Drafts Won</th>
            <th>OMW%</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((result, index) => (
            <tr key={result.id}>
              <td>{index + 1}</td>
              <td className="td-no-wrap">
                {result.player.firstName} {result.player.lastName}
              </td>
              <td>{result.points}</td>
              <td>{result.draftsWon}</td>
              <td>
                {result.opponentMatchWinPercentage != 0
                  ? result.opponentMatchWinPercentage
                  : Math.random().toPrecision(3).toString().substring(1, 5)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
};

export default StandingsTable;
