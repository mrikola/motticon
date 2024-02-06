import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { PersonPlusFill } from "react-bootstrap-icons";
import MTGAutocompleteInput from "../../components/general/MTGAutocompleteInput";
import { Item } from "react-datalist-input";

const AutocompleteTest = () => {
  const [selectedCard, setSelectedCard] = useState<Item>({
    value: "No card selected",
    id: "",
  });
  const [buttonText, setButtonText] = useState<string>("No card selected");
  const [cardImageUrl, setCardImageUrl] = useState<string>("");

  function handleClick() {
    setCardImageUrl(getScryfallUrl(selectedCard.id));
  }

  function getScryfallUrl(id: string) {
    const baseUrl = "https://cards.scryfall.io/art_crop/front/";
    const uniqueUrl = id.charAt(0) + "/" + id.charAt(1) + "/" + id + ".jpg";
    return baseUrl + uniqueUrl;
  }

  useEffect(() => {
    if (selectedCard) {
      setButtonText(selectedCard.value);
    }
  }, [selectedCard]);

  return (
    <Container>
      <h1>Card search test</h1>
      <Row>
        <Col xs={12}>
          <MTGAutocompleteInput
            labelText={"Choose card"}
            setSelectedCard={setSelectedCard}
          />
        </Col>
        <Col xs={12} className="my-3 d-grid">
          <Button variant="primary" onClick={handleClick}>
            <PersonPlusFill className="fs-4" /> {buttonText}
          </Button>
        </Col>
        <Col xs={12}>
          <img src={cardImageUrl} className="add-cube-image" />
        </Col>
      </Row>
    </Container>
  );
};

export default AutocompleteTest;
