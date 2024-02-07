import { Table } from "react-bootstrap";
import { StandingsRow } from "../../types/Tournament";
import { useEffect, useState } from "react";
import { get } from "../../services/ApiService";

type Props = {
  roundNumber: number;
  tournamentId: number;
};

const StandingsTable = ({ roundNumber, tournamentId }: Props) => {
  const [standings, setStandings] = useState<StandingsRow[]>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(
        `/tournament/${tournamentId}/standings/${roundNumber}`
      );
      const roundStandings = (await response.json()) as StandingsRow[];
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
            <tr key={index}>
              <td>{index + 1}</td>
              <td className="td-no-wrap">
                {result.firstName} {result.lastName}
              </td>
              <td>{result.matchPoints}</td>
              <td>{result.draftsWon}</td>
              <td>
                {result.opponentMatchWinPercentage != 0
                  ? (result.opponentMatchWinPercentage * 100).toPrecision(5)
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
