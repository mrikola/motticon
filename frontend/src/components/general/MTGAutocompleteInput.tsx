import { useMemo, useState } from "react";
import DatalistInput, { Item } from "react-datalist-input";
import "react-datalist-input/dist/styles.css";
import { get } from "../../services/ApiService";
import { Card } from "../../types/Card";

type Props = {
  labelText: string;
  setSelectedCard: (val: Card) => void;
};

const MTGAutocompleteInput = ({ labelText, setSelectedCard }: Props) => {
  const [item, setItem] = useState(); // The selected item will be stored in this state.
  const [value, setValue] = useState("");
  const [cards, setCards] = useState<Card[]>([]);

  // Make sure each option has an unique id and a value
  const items = useMemo(
    () =>
      cards.map((card: Card) => ({
        // required: id and value
        id: card.scryfallId,
        value: card.name + " [" + card.set + "]",
        // optional: label, node
        // label: option.name, // use a custom label instead of the value
        // node: option.name, // use a custom ReactNode to display the option
      })),
    [cards]
  );

  function handleSelection(item: Item) {
    setItem(item);
    setSelectedCard(item);
    // Custom behavior: Clear input field once a value has been selected
    setValue("");
    // Clear the cards Item-array
    setCards([]);
  }

  function search(value: string) {
    if (value.length > 1) {
      const fetchData = async () => {
        const response = await get(`/card/search/${encodeURIComponent(value)}`);
        // const r = await response.json();
        // console.log(r);
        const resp = (await response.json()) as Card[];
        setCards(resp);
      };
      fetchData();
    }
  }

  if (cards) {
    return (
      <DatalistInput
        label={labelText}
        placeholder="Type to search..."
        items={items}
        selectedItem={item}
        value={value}
        setValue={setValue}
        onSelect={(item) => {
          handleSelection(item);
        }}
        inputProps={{
          // onChange called on input change, receives the change `Event`
          onChange: (e) => search(e.target.value),
        }}
      />
    );
  }
};

export default MTGAutocompleteInput;
