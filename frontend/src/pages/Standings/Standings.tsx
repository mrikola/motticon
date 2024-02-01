import { Table, Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { get } from "../../services/ApiService";
import { ScoreHistory } from "../../types/Tournament";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";

function Standings() {
  const { roundNumber, tournamentId } = useParams();
  const user = useContext(UserInfoContext);
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

  if (standings && user) {
    return (
      <Container className="mt-3 my-md-4">
        <HelmetTitle titleText={"Standings Round " + { roundNumber }} />
        <Row>
          <BackButton
            buttonText="Back to tournament"
            path={`/tournament/${tournamentId}`}
          />

          <h1 className="display-1">Standings after round {roundNumber}</h1>
        </Row>
        <Row>
          <Col xs={12}>
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
                  <tr
                    key={result.id}
                    className={
                      user.id === result.playerId ? "table-primary" : ""
                    }
                  >
                    <td>{index + 1}</td>
                    <td className="td-no-wrap">
                      {result.player.firstName} {result.player.lastName}
                    </td>
                    <td>{result.points}</td>
                    <td>{result.draftsWon}</td>
                    <td>
                      {result.opponentMatchWinPercentage != 0
                        ? result.opponentMatchWinPercentage
                        : Math.random()
                            .toPrecision(3)
                            .toString()
                            .substring(1, 5)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  } else {
    return (
      <Container className="mt-3 my-md-4">
        <Row>
          <BackButton
            buttonText="Back to tournament"
            path={`/tournament/${tournamentId}`}
          />
          <h1 className="display-1">
            No standings found for round {roundNumber}
          </h1>
        </Row>
      </Container>
    );
  }
}

export default Standings;
