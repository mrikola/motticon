import { Button, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { Draft, DraftPodSeat } from "../../types/Tournament";
import { postFormData } from "../../services/ApiService";
import { CheckSquareFill } from "react-bootstrap-icons";

type Props = {
  seat: DraftPodSeat;
  tournamentId: number;
  done: boolean;
  setDone: (value: boolean) => void;
  setDraft: (draft: Draft) => void;
};

function DeckBuildingSubmission({
  seat,
  tournamentId,
  done,
  setDone,
  setDraft,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStatus("initial");
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setStatus("uploading");

      const formData = new FormData();
      formData.append("photo", file);

      try {
        const result = await postFormData(
          `/tournament/${tournamentId}/submitDeck/${seat.id}`,
          formData
        );
        const draft = (await result.json()) as Draft;
        setStatus("success");
        if (draft !== null) {
          console.log(draft);
          setDone(true);
          setDraft(draft);
        }
      } catch (error) {
        console.error(error);
        setStatus("fail");
      }
    }
  };

  return (
    <Row>
      {done ? (
        <>
          <h2 className="icon-link">
            Your deck building done <CheckSquareFill className="text-success" />
          </h2>
          <p>Waiting for other players to submit their decks.</p>
        </>
      ) : (
        <>
          <h2>Deck building</h2>
          <p>
            After the draft, please submit a photo showing all the cards you
            have drafted.
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
              disabled={done}
            >
              Complete deck building
            </Button>
            upload status: {status}
          </Col>
        </>
      )}
    </Row>
  );
}

export default DeckBuildingSubmission;
