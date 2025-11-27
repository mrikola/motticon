import { Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { get } from "../../services/ApiService";
import { DraftPod, DraftPodStandingsRow, Match } from "../../types/Tournament";
import { User } from "../../types/User";
import Loading from "../general/Loading";
import { BoxArrowUpRight } from "react-bootstrap-icons";

type Props = {
  pod: DraftPod;
  user: User;
  draftIndex: number;
  standings?: DraftPodStandingsRow[];
  matches?: Match[];
};

function PodResultsView({
  pod,
  user,
  draftIndex,
  standings: providedStandings,
  matches: providedMatches,
}: Props) {
  const [standings, setStandings] = useState<DraftPodStandingsRow[]>();
  const [matches, setMatches] = useState<Match[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If data is provided via props, use it and skip fetching
    if (providedStandings !== undefined && providedMatches !== undefined) {
      setStandings(providedStandings);
      setMatches(providedMatches);
      setLoading(false);
      return;
    }

    // Otherwise, fetch the data
    const fetchData = async () => {
      try {
        setLoading(true);
        const [standingsResp, matchesResp] = await Promise.all([
          get(`/draft/pod/${pod.id}/standings`),
          get(`/draft/pod/${pod.id}/matches`),
        ]);
        const standingsData =
          (await standingsResp.json()) as DraftPodStandingsRow[];
        const matchesData = (await matchesResp.json()) as Match[];
        setStandings(standingsData);
        setMatches(matchesData);
      } catch (error) {
        console.error("Error fetching pod results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pod.id, providedStandings, providedMatches]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Row>
      <h2>Draft {draftIndex + 1}</h2>
      <h3>
        Pod {pod.podNumber}, {pod.cube?.title}
      </h3>
      {standings && standings.length > 0 && (
        <>
          <h4>Standings</h4>
          <Table striped borderless responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Match Points</th>
                <th>OMW%</th>
                <th>Record</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((result, index) => {
                const gamesLost = result.gamesPlayed - result.gamesWon;
                const record = `${result.gamesWon}-${gamesLost}`;
                // Find the seat for this player to get their deck photo URL
                const playerSeat = pod.seats.find(
                  (seat) => seat.player?.id === result.playerId
                );
                const hasDeckPhoto = playerSeat?.deckPhotoUrl != null;

                return (
                  <tr
                    key={result.playerId}
                    className={
                      user.id === result.playerId ? "table-primary" : ""
                    }
                  >
                    <td>{index + 1}</td>
                    <td className="td-no-wrap">
                      {hasDeckPhoto ? (
                        <a
                          href={playerSeat.deckPhotoUrl ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          {result.firstName} {result.lastName}{" "}
                          <BoxArrowUpRight className="ms-1" size={16} />
                        </a>
                      ) : (
                        <>
                          {result.firstName} {result.lastName}
                        </>
                      )}
                    </td>
                    <td>{result.matchPoints}</td>
                    <td>
                      {result.opponentMatchWinPercentage !== 0
                        ? (result.opponentMatchWinPercentage * 100).toPrecision(
                            5
                          )
                        : "-"}
                    </td>
                    <td>{record}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
      {matches && matches.length > 0 && (
        <>
          <h4>Match Log</h4>
          <Table striped borderless responsive>
            <thead>
              <tr>
                <th>Round</th>
                <th>Player 1</th>
                <th>Score</th>
                <th>Player 2</th>
              </tr>
            </thead>
            <tbody>
              {matches
                .sort(
                  (a, b) =>
                    (a.round?.roundNumber ?? 0) - (b.round?.roundNumber ?? 0)
                )
                .map((match) => (
                  <tr key={match.id}>
                    <td>{match.round?.roundNumber ?? "-"}</td>
                    <td
                      className={
                        user.id === match.player1.id ? "table-primary" : ""
                      }
                    >
                      {match.player1.firstName} {match.player1.lastName}
                    </td>
                    <td>
                      {match.player1GamesWon} - {match.player2GamesWon}
                    </td>
                    <td
                      className={
                        user.id === match.player2.id ? "table-primary" : ""
                      }
                    >
                      {match.player2.firstName} {match.player2.lastName}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      )}
    </Row>
  );
}

export default PodResultsView;
