import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { PersonPlusFill } from "react-bootstrap-icons";
import MTGAutocompleteInput from "../../components/general/MTGAutocompleteInput";
import { Item } from "react-datalist-input";
import { toast } from "react-toastify";
import { Draft } from "../../types/Tournament";
import { postFormData } from "../../services/ApiService";
import React from "react";

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

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");

  const uploadStarted = () =>
    toast("Uploading, please wait...", {
      type: "warning",
      autoClose: false,
      toastId: "uploadToast",
    });

  const uploadSuccess = () =>
    toast.update("uploadToast", {
      render: "Uploaded successfully",
      type: "success",
      autoClose: 2000,
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStatus("initial");
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      uploadStarted();
      setStatus("uploading");

      const formData = new FormData();
      formData.append("photo", file);

      try {
        const result = await postFormData(
          `/tournament/3/submitDeck/3`,
          formData
        );
        const draft = (await result.json()) as Draft;
        setStatus("success");
        if (draft !== null) {
          uploadSuccess();
          console.log(draft);
          // setDone(true);
          // setDraft(draft);
        }
      } catch (error) {
        console.error(error);
        setStatus("fail");
      }
    }
  };

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
        <h2>Deck building</h2>
        <p>
          After the draft, please submit a photo showing all the cards you have
          drafted.
        </p>
        <Col className="d-grid gap-2">
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Draft pool photo</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Button
            variant="primary"
            className="btn-lg"
            onClick={() => handleUpload()}
          >
            Complete deck building
          </Button>
          upload status: {status}
        </Col>
      </Row>
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
