import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { get } from "../../services/ApiService";
import { Accordion, Col, Container, Row, Table } from "react-bootstrap";
import { Draft, Tournament } from "../../types/Tournament";
import { useIsTournamentStaff } from "../../utils/auth";
import Loading from "../../components/general/Loading";
import BackButton from "../../components/general/BackButton";
import { Link } from "react-router-dom";

function AllPoolsView() {
  const { tournamentId } = useParams();
  const user = useIsTournamentStaff(Number(tournamentId));
  const [tournament, setTournament] = useState<Tournament>();
  const [drafts, setDrafts] = useState<Draft[]>();

  useEffect(() => {
    const fetchData = async () => {
      const [resp] = await Promise.all([
        get(`/tournament/${tournamentId}/drafts`),
      ]);
      try {
        const tourny = (await resp.json()) as Tournament;
        console.log(tourny);
        setTournament(tourny);
        setDrafts(tourny.drafts.sort((a, b) => a.draftNumber - b.draftNumber));
      } catch {
        // TODO handle invalid response
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return user && tournament && drafts ? (
    <Container className="mt-3 my-md-4">
      <Row>
        <BackButton
          buttonText="Back to tournament"
          path={`/tournament/${tournamentId}`}
        />
        <h1 className="display-1">{tournament.name}</h1>
        <h2>All draft pools</h2>
        <p className="lead">
          Click the draft pod number to show all players for that pod. Click on
          a player name to open their draft pool as an image in a new tab.
        </p>
      </Row>
      {drafts.map((draft, index) => (
        <Col xs={12} key={index}>
          <h2 className="display-3">Draft {draft.draftNumber}</h2>
          <Accordion defaultActiveKey="0" flush className="staff-accordion">
            {draft.pods.map((pod, i) => (
              <Accordion.Item eventKey={pod.id.toString()} key={pod.id}>
                <Accordion.Header>
                  <h3>
                    Pod {pod.podNumber}, {pod.cube?.title}
                  </h3>
                </Accordion.Header>
                <Accordion.Body className="px-0">
                  <Table striped responsive key={i}>
                    <thead>
                      <tr>
                        <th>Pod</th>
                        <th>Seat</th>
                        <th>Player name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pod.seats.map((seat) => (
                        <tr key={seat.id}>
                          <td>{pod.podNumber}</td>
                          <td>{seat.seat}</td>
                          <td>
                            {seat.deckPhotoUrl ? (
                              <Link
                                to={seat.deckPhotoUrl}
                                target="_blank"
                                className="text-dark"
                              >
                                {seat.player?.firstName} {seat.player?.lastName}
                              </Link>
                            ) : (
                              <>
                                {seat.player?.firstName} {seat.player?.lastName}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      ))}
    </Container>
  ) : (
    <Loading />
  );
}
export default AllPoolsView;
