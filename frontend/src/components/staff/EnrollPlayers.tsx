import { useEffect, useMemo, useState } from "react";
import { get, post } from "../../services/ApiService";
import { Enrollment, Player } from "../../types/User";
import { Button, Col, Row } from "react-bootstrap";
import DatalistInput, { Item } from "react-datalist-input";
import "react-datalist-input/dist/styles.css";
import { PersonPlusFill } from "react-bootstrap-icons";

type Props = {
  enrollments: Enrollment[];
  tournamentId: number;
};

const EnrollPlayers = ({ enrollments, tournamentId }: Props) => {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [item, setItem] = useState<Item>(); // The selected item will be stored in this state.
  const [value, setValue] = useState<string>();
  const [selectedPlayer, setSelectedPlayer] = useState("No player selected");

  // set data list options based on enrolled players
  useEffect(() => {
    if (allPlayers.length > 0) {
      const players: Player[] = [];
      for (let i = 0; i < enrollments.length; i++) {
        players.push(enrollments[i].player);
      }
      const playersIdOnly = players.map((x) => x.id);
      const notEnrolled = allPlayers.filter(
        (item) => !playersIdOnly.includes(item.id)
      );
      setAvailablePlayers(notEnrolled);
    }
  }, [allPlayers]);

  // Make sure each option has an unique id and a value
  const items = useMemo(
    () =>
      availablePlayers.map((player) => ({
        // required: id and value
        value: player.firstName + " " + player.lastName,
        // optional: label, node
        // label: option.name, // use a custom label instead of the value
        // node: option.name, // use a custom ReactNode to display the option
        ...player, // pass along any other properties to access in your onSelect callback
      })),
    [availablePlayers]
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/user`);
      const players = (await response.json()) as Player[];
      setAllPlayers(players);
    };
    fetchData();
  }, []);

  function enroll() {
    if (item) {
      const userId = item.id;
      post(`/tournament/${tournamentId}/enroll/${userId}`, {}).then(
        async (resp) => {
          // temporary solution that just checks boolean return (should be object with tournament info)
          const enrolled = await resp.text();
          if (enrolled) {
            console.log(enrolled);
            setItem(undefined);
            setSelectedPlayer("No player selected");
          }
        }
      );
    } else {
      console.log("no player selected");
    }
  }

  function handleSelection(item: Item) {
    setItem(item);
    console.log(item);
    setSelectedPlayer("Enroll: " + item.value);
    setValue(undefined); // Custom behavior: Clear input field once a value has been selected
  }

  if (allPlayers) {
    return (
      <Row>
        <Col xs={12}>
          <DatalistInput
            label="Enroll player"
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
          <Button variant="primary" onClick={enroll}>
            <PersonPlusFill className="fs-4" /> {selectedPlayer}
          </Button>
        </Col>
      </Row>
    );
  }
};

export default EnrollPlayers;
