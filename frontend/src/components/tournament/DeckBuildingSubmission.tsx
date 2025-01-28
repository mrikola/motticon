import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Popover,
  Row,
} from "react-bootstrap";
import { useState } from "react";
import { Draft, DraftPodSeat } from "../../types/Tournament";
import { postFormData } from "../../services/ApiService";
import { InfoCircleFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { Cube } from "../../types/Cube";

type Props = {
  seat: DraftPodSeat;
  cube: Cube;
  photoUrl: string | undefined;
  tournamentId: number;
  done: boolean;
  setDraft: (draft: Draft) => void;
  POOLSIZE: number;
};

const photoSubmissionPopover = (
  <Popover className="photo-popover">
    <Popover.Header as="h3">Taking a photo</Popover.Header>
    <Popover.Body>
      <p>
        Make sure all your cards are in the photo, and that their card names are
        visible. Check that cards belonging to other people are not in the
        photo.
      </p>
      <p className="mb-0">
        Both portrait and landscape modes are OK, but we recommend that you
        submit a photo with the card names oriented so that you can read them.
      </p>
    </Popover.Body>
  </Popover>
);

function DeckBuildingSubmission({
  seat,
  photoUrl,
  tournamentId,
  done,
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
      formData.append("file", file);

      try {
        const result = await postFormData(
          `/draft/tournament/${tournamentId}/submitDeck/${seat.id}`,
          formData
        );
        const draft = (await result.json()) as Draft;
        if (result.ok && draft !== null) {
          console.log(draft);
          uploadSuccess();
          //setDone(true);
          setDraft(draft);
        }
        if (!result.ok) {
          uploadFailed();
        }
      } catch (error) {
        console.error(error);
        uploadFailed();
      }
    }
  };

  // for testing only
  // const resetPicked = async () => {
  //   console.log("attempting to reset picks for id: " + seat.id);
  //   const response = await get(
  //     `/cube/${cube.id}/pickedCards/return/${seat.id}`
  //   );
  //   const success = (await response.json()) as boolean;
  //   console.log(success);
  // };

  return (
    <Row>
      <h2>
        Draft pool submission{" "}
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={photoSubmissionPopover}
          rootClose
        >
          <InfoCircleFill className="text-primary" />
        </OverlayTrigger>
      </h2>

      {photoUrl ? (
        <h3>Deck submitted successfully</h3>
      ) : (
        <Col className="d-grid gap-2">
          <p>
            After the draft, please submit a photo showing all the cards you
            drafted. Make sure the names of all cards are visible.
          </p>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label className="lead">Draft pool photo</Form.Label>
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
    </Row>
  );
}

export default DeckBuildingSubmission;
