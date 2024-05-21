import { useEffect, useMemo, useState } from "react";
import DatalistInput, { Item } from "react-datalist-input";
import "react-datalist-input/dist/styles.css";
import { CardAndQuantity, ListedCard } from "../../types/Cube";

type Props = {
  labelText: string;
  cubeCards: ListedCard[];
  usedCards: CardAndQuantity[];
  addToUsedCards: (cards: ListedCard[]) => void;
  disabled: boolean;
};

const CubeAutocompleteInput = ({
  labelText,
  cubeCards,
  usedCards,
  addToUsedCards,
  disabled,
}: Props) => {
  // const [item, setItem] = useState(); // The selected item will be stored in this state.
  const [value, setValue] = useState("");
  // const [cards, setCards] = useState<ListedCard[]>([]);
  const [availableCards, setAvailableCards] = useState<ListedCard[]>([]);

  // Make sure each option has an unique id and a value
  const items = useMemo(
    () =>
      availableCards.map((listedCard: ListedCard) => ({
        // required: id and value
        id: listedCard.card.scryfallId,
        value: listedCard.card.name + " [" + listedCard.card.set + "]",
        card: listedCard,
        // optional: label, node
        // label: option.name, // use a custom label instead of the value
        // node: option.name, // use a custom ReactNode to display the option
      })),
    [availableCards]
  );

  // set data list options based on used cards
  useEffect(() => {
    if (cubeCards.length > 0) {
      const cards: ListedCard[] = [];
      for (let i = 0; i < usedCards.length; i++) {
        cards.push(usedCards[i].listedCard);
      }
      const cardsIdOnly = cards.map((c) => c.card.id);
      const notUsed: ListedCard[] = cubeCards.filter(
        (c) => !cardsIdOnly.includes(c.card.id)
      );
      notUsed.sort((a, b) => a.card.name.localeCompare(b.card.name));
      setAvailableCards(notUsed);
    }
  }, [cubeCards, usedCards]);

  function handleSelection(item: Item) {
    console.log(item.card);
    // setItem(item);
    addToUsedCards([item.card]);
    // Custom behavior: Clear input field once a value has been selected
    setValue("");

    // Clear the cards Item-array
    //setCards([]);
  }

  // function search(value: string) {
  //   if (value.length > 1) {
  //     const fetchData = async () => {
  //       const response = await get(`/card/search/${encodeURIComponent(value)}`);
  //       // todo: change backend to return ListedCard not Card, or change this
  //       const resp = (await response.json()) as ListedCard[];
  //       setCards(resp);
  //     };
  //     fetchData();
  //   }
  // }

  return (
    <DatalistInput
      label={labelText}
      aria-disabled={disabled}
      placeholder="Type to search..."
      items={items}
      value={value}
      setValue={setValue}
      onSelect={(item) => {
        handleSelection(item);
      }}
      inputProps={{
        // onChange called on input change, receives the change `Event`

        disabled: disabled,
      }}
    />
  );
};

export default CubeAutocompleteInput;
