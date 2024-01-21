import { useCallback, useEffect, useMemo, useState } from "react";
import { get, post } from "../../services/ApiService";
import { Player } from "../../types/User";
import { Button, Col, InputGroup, Row } from "react-bootstrap";
import DatalistInput from "react-datalist-input";
import "react-datalist-input/dist/styles.css";
import { PersonPlusFill } from "react-bootstrap-icons";

type Props = {
  tournamentId: number;
};

const EnrollPlayers = ({ tournamentId }: Props) => {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [item, setItem] = useState(); // The selected item will be stored in this state.

  /**
   * The onSelect callback function is called if the user selects one option out of the dropdown menu.
   * @param selectedItem object (the selected item / option)
   */
  const onSelect = useCallback((selectedItem) => {
    console.log("selectedItem", selectedItem);
    setItem(selectedItem);
  }, []);

  // Make sure each option has an unique id and a value
  const items = useMemo(
    () =>
      allPlayers.map((player) => ({
        // required: id and value
        id: player.id,
        value: player.firstName + " " + player.lastName,
        // optional: label, node
        // label: option.name, // use a custom label instead of the value
        // node: option.name, // use a custom ReactNode to display the option
        ...player, // pass along any other properties to access in your onSelect callback
      })),
    [allPlayers]
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
      // todo: reset the search input
      const userId = item.id;
      console.log("enrolling: " + item.id);
      post(`/tournament/${tournamentId}/enroll/${userId}`, {}).then(
        async (resp) => {
          // temporary solution that just checks boolean return (should be object with tournament info)
          const enrolled = await resp.text();
          if (enrolled) {
            console.log(enrolled);
          }
        }
      );
    }
  }

  if (allPlayers) {
    return (
      <Row>
        <Col xs={12}>
          <DatalistInput
            label="Enroll player"
            placeholder="Type to search..."
            items={items}
            onSelect={onSelect}
          />
        </Col>
        <Col xs={12} className="my-3 d-grid">
          <Button variant="primary" onClick={enroll}>
            <PersonPlusFill className="fs-4" /> Enroll player
          </Button>
        </Col>
      </Row>
    );
  }
};

export default EnrollPlayers;
