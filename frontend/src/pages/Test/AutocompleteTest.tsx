import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { PersonPlusFill } from "react-bootstrap-icons";
import MTGAutocompleteInput from "../../components/general/MTGAutocompleteInput";
import { Item } from "react-datalist-input";
import { toast } from "react-toastify";

const AutocompleteTest = () => {
  const [selectedCard, setSelectedCard] = useState<Item>({
    value: "No card selected",
    id: "",
  });
  const [buttonText, setButtonText] = useState<string>("No card selected");
  const [cardImageUrl, setCardImageUrl] = useState<string>("");

  const success = () => toast.success("Wow success!");

  const warning = () => toast.warning("warning warning!");

  const error = () => toast.error("oh no error!");

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
          <Button variant="primary" onClick={success}>
            Success !
          </Button>
          <Button variant="primary" onClick={warning}>
            warning !
          </Button>
          <Button variant="primary" onClick={error}>
            error !
          </Button>
        </Col>
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
