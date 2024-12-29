import { Col, Container, Row, Table } from "react-bootstrap";
import { useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { get } from "../../services/ApiService";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import Loading from "../../components/general/Loading";
import { DraftPod, Tournament } from "../../types/Tournament";
import DraftPoolButton from "../../components/general/DraftPoolButton";

function DraftPods() {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [tournament, setTournament] = useState<Tournament>();
  const [userDraftPods, setUserDraftPods] = useState<DraftPod[]>();

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const resp = await get(`/tournament/${tournamentId}/drafts`);
        const tourny = (await resp.json()) as Tournament;
        setTournament(tourny);
        const userPods = [];
        for (const draft of tourny.drafts.sort(
          (a, b) => a.draftNumber - b.draftNumber
        )) {
          for (const pod of draft.pods) {
            for (const seat of pod.seats) {
              if (seat.player?.id === user?.id) {
                userPods.push(pod);
              }
            }
          }
        }
        setUserDraftPods(userPods);
      };
      fetchData();
    }
  }, [tournamentId, user]);

  if (user) {
    return (
      tournament &&
      userDraftPods && (
        <Container className="mt-3 my-md-4">
          <HelmetTitle titleText={tournament.name + " Draft Pods"} />
          <Row>
            <BackButton
              buttonText="Back to tournament"
              path={`/tournament/${tournamentId}`}
            />
            <h1 className="display-1">{tournament.name}</h1>
            <h2 className="display-2">My draft pods</h2>
          </Row>
          <Row>
            {userDraftPods.map((pod, index) => (
              <Row key={index}>
                <h2>Draft {index + 1}</h2>
                <h3>
                  Pod {pod.podNumber}, {pod.cube?.title}
                </h3>
                {pod.seats
                  .sort((a, b) => a.seat - b.seat)
                  .map((seat) => (
                    <div key={seat.id}>
                      {user.id === seat.player?.id && seat.deckPhotoUrl ? (
                        <Col
                          xs={10}
                          sm={8}
                          className="d-grid gap-2 my-3 mx-auto"
                          key={seat.id}
                        >
                          <DraftPoolButton seat={seat} />
                        </Col>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                <Table striped borderless responsive>
                  <thead>
                    <tr>
                      <th>Seat</th>
                      <th>Player</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pod.seats
                      .sort((a, b) => a.seat - b.seat)
                      .map((seat) => (
                        <tr
                          key={seat.id}
                          className={
                            user.id === seat.player?.id ? "table-primary" : ""
                          }
                        >
                          <td>{seat.seat}</td>
                          <td className="td-no-wrap">
                            {seat.player?.firstName} {seat.player?.lastName}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Row>
            ))}
          </Row>
        </Container>
      )
    );
  } else {
    <Loading />;
  }
}

export default DraftPods;
