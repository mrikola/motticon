import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { get, post } from "../../services/ApiService";
import { useParams } from "react-router";
import { useIsAdmin } from "../../utils/auth";
import Loading from "../../components/general/Loading";
import { Enrollment, Player, Preference } from "../../types/User";
import { Cube } from "../../types/Cube";
import { Draft, DraftPod, Tournament } from "../../types/Tournament";

type DryPlayer = {
  playerId: number;
  player: Player;
  preferences: Preference[];
  cubes: Cube[];
};

const TestPreferencesTable = () => {
  const user = useIsAdmin();
  const { tournamentId } = useParams();
  const [dryPlayers1, setDryPlayers1] = useState<DryPlayer[]>([]);
  const [dryPlayers2, setDryPlayers2] = useState<DryPlayer[]>([]);
  const [dryPlayers3, setDryPlayers3] = useState<DryPlayer[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [rawPreference, setRawPreferences] = useState<Preference[]>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/preferences`);
      const preferences = (await response.json()) as Preference[];
      setRawPreferences(preferences);
      console.log(preferences);
      const newDrys: DryPlayer[] = [];
      for (const player of dryPlayers1) {
        const pref: Preference[] = preferences.filter(
          (preference) => preference.player.id === player.playerId
        );
        newDrys.push({
          playerId: player.player.id,
          player: player.player,
          preferences: pref,
          cubes: player.cubes,
        });
      }
      setDryPlayers2(newDrys);
    };
    fetchData();
  }, [tournamentId, dryPlayers1]);
  // ("/draft/pods/:draftId");
  // useEffect(() => {
  //   if (drafts.length > 0) {
  //     const fetchData = async () => {
  //       const draft1 = await get(`/draft/pods/${drafts[0].id}`);
  //       const draft2 = await get(`/draft/pods/${drafts[1].id}`);
  //       const draft3 = await get(`/draft/pods/${drafts[2].id}`);
  //       const pods1 = (await draft1.json()) as DraftPod[];
  //       const pods2 = (await draft2.json()) as DraftPod[];
  //       const pods3 = (await draft3.json()) as DraftPod[];
  //       // console.log(pods1);

  //       const result = drafts.filter((draft) =>
  //         draft.pods.some(
  //           (pod) => pod.seats.some((seat) => seat.player.id === 71) // Filter condition
  //         )
  //       );
  //       // console.log(result);
  //       // const filteredPod = pods1.filter();

  //       const newDrys: DryPlayer[] = [];
  //       for (const player of dryPlayers2) {
  //         const cubes = d;
  //         const pref: Preference[] = preferences.filter(
  //           (preference) => preference.player.id === player.playerId
  //         );
  //         newDrys.push({
  //           playerId: player.player.id,
  //           player: player.player,
  //           preferences: pref,
  //           cubes: [],
  //         });
  //       }
  //       setDryPlayers3(newDrys);
  //     };
  //     fetchData();
  //   }
  // }, [drafts]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/drafts`);
      const tourny = (await resp.json()) as Tournament;
      setDrafts(tourny.drafts);
      console.log(tourny.drafts);

      const newDrys: DryPlayer[] = [];
      for (const player of dryPlayers2) {
        const cubes: Cube[] = [];
        cubes.push(
          tourny.drafts[0].pods.filter((pod) =>
            pod.seats.some((seat) => seat.player.id === player.playerId)
          )[0].cube
        );
        cubes.push(
          tourny.drafts[1].pods.filter((pod) =>
            pod.seats.some((seat) => seat.player.id === player.playerId)
          )[0].cube
        );
        cubes.push(
          tourny.drafts[2].pods.filter((pod) =>
            pod.seats.some((seat) => seat.player.id === player.playerId)
          )[0].cube
        );
        newDrys.push({
          playerId: player.player.id,
          player: player.player,
          preferences: player.preferences,
          cubes: cubes,
        });
      }
      setDryPlayers3(newDrys);

      console.log(
        tourny.drafts[0].pods.filter((pod) =>
          pod.seats.some((seat) => seat.player.id === 71)
        )
      );
      console.log(
        tourny.drafts[1].pods.filter((pod) =>
          pod.seats.some((seat) => seat.player.id === 71)
        )
      );
      console.log(
        tourny.drafts[2].pods.filter((pod) =>
          pod.seats.some((seat) => seat.player.id === 71)
        )
      );
    };
    fetchData();
  }, [dryPlayers2]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/enrollment`);
      const tourny = (await resp.json()) as Tournament;

      setEnrollments(tourny.enrollments);
      const players: DryPlayer[] = [];
      for (const enrollment of enrollments) {
        players.push({
          playerId: enrollment.player.id,
          player: enrollment.player,
          preferences: [],
          cubes: [],
        });
      }
      setDryPlayers1(players);
    };
    fetchData();
  }, [tournamentId]);

  function dryRun() {
    console.log("calling dry runn");
    const fetchData = async () => {
      const response = await get(`/dry-run`);
    };
    fetchData();
  }

  function dryRunUsers() {
    console.log("calling dry run users");
    const fetchData = async () => {
      const response = await get(`/dry-run/users`);
    };
    fetchData();
  }

  return user && dryPlayers3 && rawPreference ? (
    <Container className="mt-3 my-md-4">
      <Row className="my-3">
        <Col xs={12}>
          <h1 className="display-1">Player cube preferences</h1>
        </Col>
        <Col xs={12}>
          <Button variant="primary" className="btn-lg" onClick={dryRun}>
            Do dry run
          </Button>
          <Button variant="primary" className="btn-lg" onClick={dryRunUsers}>
            Generate dry run users
          </Button>
        </Col>
        <Col xs={12} className="d-grid gap-2 mx-auto">
          <Table striped responsive>
            <thead>
              <tr>
                <th>number</th>
                <th>Name</th>
                <th>Draft 1 cube </th>
                <th>Draft 2 cube</th>
                <th>Draft 3 cube</th>
                <th>Pref 1</th>
                <th>Pref 2</th>
                <th>Pref 3</th>
                <th>Pref 4</th>
                <th>Pref 5</th>
              </tr>
            </thead>
            <tbody>
              {dryPlayers3.map((player, index) => (
                <tr key={index}>
                  <td>
                    {index} id: {player.playerId}
                  </td>
                  <td>
                    {player.player.firstName} {player.player.lastName}
                  </td>

                  {player.cubes.map((cube) => (
                    <td key={`c-${cube.id}-p-${player.playerId}`}>
                      {cube.title} c-${cube.id}-p-${player.playerId} (
                      {player.preferences.some(
                        (pref) => pref.cube.id === cube.id
                      )
                        ? "yes"
                        : "no"}
                      )
                    </td>
                  ))}
                  {player.preferences.map((pref) => (
                    <td key={pref.id}>
                      {pref.cube.title} ({pref.points})
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <h2>drafts</h2>

        {drafts.map((draft, index) => (
          <Col xs={12} key={index}>
            <h2>Draft {draft.draftNumber}</h2>

            {draft.pods.map((pod, i) => (
              <Table striped responsive key={i}>
                <thead>
                  <tr>
                    <th>draft number </th>
                    <th>pod number</th>
                    <th>cube name </th>
                    <th>player name</th>
                    <th>player id</th>
                  </tr>
                </thead>
                <tbody>
                  {pod.seats.map((seat) => (
                    <tr key={seat.id}>
                      <td>{draft.draftNumber}</td>
                      <td>{pod.podNumber}</td>
                      <td>
                        {pod.cube.title} (id: {pod.cube.id})
                      </td>
                      <td>
                        {seat.player.firstName} {seat.player.lastName}
                      </td>
                      <td>{seat.player.id}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ))}
          </Col>
        ))}

        <Col xs={12}>
          <h2>raw preferences</h2>
          <Table striped responsive>
            <thead>
              <tr>
                <th>pref id</th>
                <th>player id</th>
                <th>cube id </th>
                <th>cube name</th>
                <th>points</th>
              </tr>
            </thead>
            <tbody>
              {rawPreference.map((pref, index) => (
                <tr key={index}>
                  <td>{pref.id}</td>
                  <td>{pref.player.id}</td>
                  <td>{pref.cube.id}</td>
                  <td>{pref.cube.title}</td>
                  <td>{pref.points}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default TestPreferencesTable;
