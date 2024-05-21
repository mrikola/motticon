import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Draft, DraftPodSeat } from "../../types/Tournament";
import { postFormData } from "../../services/ApiService";
import { CheckSquareFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import CardPool from "./CardPool";
import { Cube } from "../../types/Cube";

type Props = {
  seat: DraftPodSeat;
  cube: Cube;
  photoUrl: string | undefined;
  tournamentId: number;
  done: boolean;
  setDone: (value: boolean) => void;
  setDraft: (draft: Draft) => void;
};

function DeckBuildingSubmission({
  seat,
  cube,
  photoUrl,
  tournamentId,
  done,
  setDone,
  setDraft,
}: Props) {
  const [file, setFile] = useState<File | null>(null);

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

  const uploadFailed = () =>
    toast.update("uploadToast", {
      render: "Upload failed",
      type: "error",
      autoClose: 2000,
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      uploadStarted();

      const formData = new FormData();
      formData.append("photo", file);

      try {
        const result = await postFormData(
          `/tournament/${tournamentId}/submitDeck/${seat.id}`,
          formData
        );
        const draft = (await result.json()) as Draft;
        if (draft !== null) {
          console.log(draft);
          uploadSuccess();
          setDone(true);
          setDraft(draft);
        }
      } catch (error) {
        console.error(error);
        uploadFailed();
      }
    }
  };

  return (
    <Row>
      {done ? (
        <>
          <h2 className="icon-link">
            Your draft pool submission done{" "}
            <CheckSquareFill className="text-success" />
          </h2>
          <p>Waiting for other players to submit their draft pools.</p>
        </>
      ) : (
        <>
          <h2>Draft pool submission</h2>

          {photoUrl ? (
            <CardPool
              cubeCards={cube.cardlist.cards}
              photoUrl={photoUrl}
              seat={seat}
            />
          ) : (
            <Col className="d-grid gap-2">
              <p>
                After the draft, please submit a photo showing all the cards you
                have drafted.
              </p>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Draft pool photo</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
              <Button
                variant="primary"
                className="btn-lg"
                onClick={() => handleUpload()}
                disabled={done || !file}
              >
                Upload draft pool photo
              </Button>
            </Col>
          )}
        </>
      )}
    </Row>
  );
}

export default DeckBuildingSubmission;
