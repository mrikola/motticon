import { Row, Table } from "react-bootstrap";
import { useParams } from "react-router";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import { User } from "../../types/User";
import { Match } from "../../types/Tournament";
import { useMemo } from "react";
import { get } from "../../services/ApiService";
import { useFetch } from "../../hooks/useFetch";
import PageContainer from "../../components/general/PageContainer";
import Loading from "../../components/general/Loading";

function MatchHistory() {
  const { tournamentId, userId } = useParams();

  const { data: matches, loading } = useFetch<Match[]>(async () => {
    const resp = await get(
      `/user/${userId}/tournament/${tournamentId}/matches`
    );
    return (await resp.json()) as Match[];
  }, [userId, tournamentId]);

  const user = useMemo(() => {
    if (!matches || matches.length === 0) return undefined;
    return matches[0].player1.id === Number(userId)
      ? matches[0].player1
      : matches[0].player2;
  }, [matches, userId]);

  if (loading || !user || !matches) {
    return <Loading />;
  }

  return (
    <PageContainer>
      <HelmetTitle
        titleText={`${user.firstName} ${user.lastName} match history`}
      />
      <Row>
        <BackButton
          buttonText="Back to tournament"
          path={`/tournament/${tournamentId}`}
        />
        <h2 className="display-2">
          {user.firstName} {user.lastName} match history
        </h2>
        <Table striped borderless responsive>
          <thead>
            <tr>
              <th>Round</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => {
              const isPlayer1 = match.player1.id === user.id;

              return (
                <tr key={match.id}>
                  <td>{index + 1}</td>
                  {isPlayer1 ? (
                    <td>
                      {match.player1.firstName} {match.player1.lastName}{" "}
                      {match.player1GamesWon} - {match.player2GamesWon}{" "}
                      {match.player2.firstName} {match.player2.lastName}
                    </td>
                  ) : (
                    <td>
                      {match.player2.firstName} {match.player2.lastName}{" "}
                      {match.player2GamesWon} - {match.player1GamesWon}{" "}
                      {match.player1.firstName} {match.player1.lastName}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Row>
    </PageContainer>
  );
}

export default MatchHistory;
