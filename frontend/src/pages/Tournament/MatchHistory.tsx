import { Container, Row, Table } from "react-bootstrap";
import { useParams } from "react-router";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import { User } from "../../types/User";
import { Match } from "../../types/Tournament";
import { useEffect, useState } from "react";
import { get } from "../../services/ApiService";

function MatchHistory() {
  const { tournamentId, userId } = useParams();

  const [matches, setMatches] = useState<Match[]>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(
        `/user/${userId}/tournament/${tournamentId}/matches`
      );
      const matches = (await resp.json()) as Match[];
      setMatches(matches);

      const user =
        matches[0].player1.id === Number(userId)
          ? matches[0].player1
          : matches[0].player2;
      setUser(user);
    };
    fetchData();
  }, [userId, tournamentId]);

  return (
    <Container className="mt-3 my-md-4">
      {user && matches ? (
        <>
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
        </>
      ) : (
        <>loading</>
      )}
    </Container>
  );
}

export default MatchHistory;
