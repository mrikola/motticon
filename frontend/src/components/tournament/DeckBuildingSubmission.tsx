import { Button, Col, Row } from "react-bootstrap";
import { useState } from "react";
import { Draft, DraftPodSeat } from "../../types/Tournament";
import { postFormData } from "../../services/ApiService";

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
      console.log("setting file", e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setStatus("uploading");

      const formData = new FormData();
      formData.append("photo", file);
      for (var key of formData.entries()) {
        console.log("key", key);
      }

      try {
        const result = await postFormData(
          `/tournament/${tournamentId}/submitDeck/${seat.id}`,
          formData
        );

        const data = await result.json();

        console.log(data);
        setStatus("success");
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
          <h2>Your deck building done.</h2>
          <p>Waiting for other players to submit their decks.</p>
          <Col className="d-grid gap-2">
            <Button
              variant="primary"
              className="btn-lg"
              onClick={() => null}
              disabled={done}
            >
              Your deck building done
            </Button>
          </Col>
        </>
      ) : (
        <>
          <h2>Deck building</h2>
          <Col className="d-grid gap-2">
            <input type="file" name="poop" onChange={handleFileChange} />
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
