import { Container, Row, Table } from "react-bootstrap";
import { useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { get } from "../../services/ApiService";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import Loading from "../../components/general/Loading";
import { DraftPod, Tournament } from "../../types/Tournament";

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
        for (const draft of tourny.drafts) {
          for (const pod of draft.pods) {
            for (const seat of pod.seats) {
              if (seat.player.id === user?.id) {
                userPods.push(pod);
              }
            }
          }
        }
        setUserDraftPods(userPods);
        console.log(userPods);
      };
      fetchData();
    }
  }, [user]);

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
            {userDraftPods
              .sort((a, b) => a.id - b.id)
              .map((pod, index) => (
                <Row key={index}>
                  <h2>Draft {index + 1}</h2>
                  <h3>
                    Pod {pod.podNumber}, {pod.cube.title}
                  </h3>
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
                              user.id === seat.player.id ? "table-primary" : ""
                            }
                          >
                            <td>{seat.seat}</td>
                            <td className="td-no-wrap">
                              {seat.player.firstName} {seat.player.lastName}
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
