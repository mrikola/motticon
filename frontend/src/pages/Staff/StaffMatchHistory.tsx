import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useParams } from "react-router";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import { useEffect, useMemo, useState } from "react";
import { get } from "../../services/ApiService";
import { useIsTournamentStaff } from "../../utils/auth";
import { Match, Tournament } from "../../types/Tournament";
import { Enrollment, Player } from "../../types/User";
import DatalistInput, { Item } from "react-datalist-input";
import { InfoCircleFill } from "react-bootstrap-icons";

function StaffMatchHistory() {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState<Tournament>();
  const user = useIsTournamentStaff(Number(tournamentId));
  const [item, setItem] = useState<Item>(); // The selected item will be stored in this state.
  const [value, setValue] = useState<string>();
  const [selectedUser, setSelectedUser] = useState("No player selected");
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([]);
  const [matches, setMatches] = useState<Match[]>();
  const [player, setPlayer] = useState<Player>();

  // Make sure each option has an unique id and a value
  const items = useMemo(
    () =>
      allEnrollments.map((enrollment) => ({
        // required: id and value
        id: enrollment.player?.id,
        value: enrollment.player?.firstName + " " + enrollment.player?.lastName,
        ...enrollment, // pass along any other properties to access in your onSelect callback
      })),
    [allEnrollments]
  );

  useEffect(() => {
    if (!tournament) {
      const fetchData = async () => {
        const response = await get(`/tournament/${tournamentId}`);
        const tourny = (await response.json()) as Tournament;
        setTournament(tourny);
      };
      if (user) {
        fetchData();
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/enrollment`);
      const tourny = (await response.json()) as Tournament;
      setAllEnrollments(tourny.enrollments);
    };
    fetchData();
  }, [tournamentId]);

  function getPlayerMatchHistory() {
    if (item) {
      const userId = item.player.id;
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
        setPlayer(user);
      };
      fetchData();
    } else {
      console.log("no user selected");
    }
  }

  function handleSelection(item: Item) {
    setItem(item);
    setSelectedUser("Get match history for: " + item.value);
    setValue(undefined); // Custom behavior: Clear input field once a value has been selected
  }

  return (
    <Container className="mt-3 my-md-4">
      {user && tournament ? (
        <>
          <HelmetTitle titleText={`${tournament.name} match history`} />
          <Row>
            <BackButton
              buttonText="Back to tournament"
              path={`/tournament/${tournamentId}`}
            />
            <h2 className="display-2">{tournament.name} match history</h2>
            <Col xs={12}>
              <DatalistInput
                label="Player match history"
                placeholder="Type to search..."
                items={items}
                selectedItem={item}
                value={value}
                setValue={(value) => setValue(value)}
                onSelect={(item) => {
                  handleSelection(item);
                }}
              />
            </Col>
            <Col xs={12} className="my-3 d-grid">
              <Button
                variant="info"
                onClick={getPlayerMatchHistory}
                disabled={!item}
              >
                <div className="icon-link text-light">
                  <InfoCircleFill className="fs-4" /> {selectedUser}
                </div>
              </Button>
            </Col>

            {matches && player ? (
              <Table striped borderless responsive>
                <thead>
                  <tr>
                    <th>Round</th>
                    <th>Table</th>
                    <th>Player 1</th>
                    <th>Player 2</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, index) => {
                    const isPlayer1 = match.player1.id === player.id;
                    return (
                      <tr key={match.id}>
                        <td>{index + 1}</td>
                        <td>{match.tableNumber}</td>
                        {isPlayer1 ? (
                          <>
                            <td>
                              {match.player1.firstName} {match.player1.lastName}
                            </td>
                            <td>
                              {match.player2.firstName} {match.player2.lastName}
                            </td>
                            <td>
                              {match.player1GamesWon} - {match.player2GamesWon}
                            </td>
                          </>
                        ) : (
                          <>
                            <td>
                              {match.player2.firstName} {match.player2.lastName}
                            </td>
                            <td>
                              {match.player1.firstName} {match.player1.lastName}
                            </td>
                            <td>
                              {match.player2GamesWon} - {match.player1GamesWon}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <h3>No user selected</h3>
            )}
          </Row>
        </>
      ) : (
        <>loading</>
      )}
    </Container>
  );
}

export default StaffMatchHistory;
