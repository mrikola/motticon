import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router";
import { useContext } from "react";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import StandingsTable from "../../components/tournament/StandingsTable";

function Standings() {
  const { roundNumber, tournamentId } = useParams();
  const user = useContext(UserInfoContext);

  if (user) {
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
            <StandingsTable
              roundNumber={Number(roundNumber)}
              tournamentId={Number(tournamentId)}
              user={user}
            />
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
