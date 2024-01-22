import { useMemo, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import DatalistInput from "react-datalist-input";
import "react-datalist-input/dist/styles.css";
import { PersonPlusFill } from "react-bootstrap-icons";

const AutocompleteTest = () => {
  const [item, setItem] = useState(); // The selected item will be stored in this state.
  const [value, setValue] = useState("");
  const [selectedCard, setSelectedCard] = useState("No card selected");
  const [cards, setCards] = useState([]);

  // Make sure each option has an unique id and a value
  const items = useMemo(
    () =>
      cards.map((card) => ({
        // required: id and value
        id: card,
        value: card,
        // optional: label, node
        // label: option.name, // use a custom label instead of the value
        // node: option.name, // use a custom ReactNode to display the option
      })),
    [cards]
  );

  function handleClick() {
    console.log("submitted: " + selectedCard);
  }

  function handleSelection(item) {
    setItem(item);
    console.log(item);
    setSelectedCard("Choose: " + item.value);
    // Custom behavior: Clear input field once a value has been selected
    setValue("");
    // Clear the cards Item-array
    setCards([]);
  }

  function cbf(value) {
    const scryfallAutocompleteUrl = `https://api.scryfall.com/cards/autocomplete?q=`;
    const origin = "http://localhost:3000/";
    if (value.length > 1) {
      const fetchData = async () => {
        const response = await fetch(scryfallAutocompleteUrl + value, {
          method: "GET",
          mode: "cors",
          headers: {
            Origin: origin,
          },
        });
        const resp = await response.json();
        const cardNames = resp.data;
        setCards(cardNames);
      };
      fetchData();
    }
  }

  if (cards) {
    return (
      <Container>
        <h1>Card search test</h1>
        <Row>
          <Col xs={12}>
            <DatalistInput
              label="Choose card"
              placeholder="Type to search..."
              items={items}
              selectedItem={item}
              value={value}
              setValue={setValue}
              onInput={() => cbf(value)}
              onSelect={(item) => {
                handleSelection(item);
              }}
            />
          </Col>
          <Col xs={12} className="my-3 d-grid">
            <Button variant="primary" onClick={handleClick}>
              <PersonPlusFill className="fs-4" /> {selectedCard}
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default AutocompleteTest;
