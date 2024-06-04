import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Draft, DraftPodSeat } from "../../types/Tournament";
import { get, postFormData } from "../../services/ApiService";
import { CheckSquareFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import CardPool from "./CardPool";
import { Cube } from "../../types/Cube";
import { PickedCard, Token } from "../../types/Card";
import DraftTokens from "./DraftTokens";

type Props = {
  seat: DraftPodSeat;
  cube: Cube;
  photoUrl: string | undefined;
  tournamentId: number;
  done: boolean;
  setDraft: (draft: Draft) => void;
  playerPickedCards: PickedCard[];
  setPlayerPickedCards: (cards: PickedCard[]) => void;
  POOLSIZE: number;
};

function DeckBuildingSubmission({
  seat,
  cube,
  photoUrl,
  tournamentId,
  done,
  setDraft,
  playerPickedCards,
  setPlayerPickedCards,
  POOLSIZE,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);

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
          //setDone(true);
          setDraft(draft);
        }
      } catch (error) {
        console.error(error);
        uploadFailed();
      }
    }
  };

  // for testing only
  const resetPicked = async () => {
    console.log("attempting to reset picks for id: " + seat.id);
    const response = await get(
      `/cube/${cube.id}/pickedCards/return/${seat.id}`
    );
    const success = (await response.json()) as boolean;
    console.log(success);
  };

  useEffect(() => {
    const tokens: Token[] = [];
    if (playerPickedCards) {
      console.log(playerPickedCards);
      for (const pc of playerPickedCards) {
        if (pc.listedCard.card.tokens) {
          for (const token of pc.listedCard.card.tokens) {
            const existingTokens = tokens.filter(
              (t) =>
                t.name === token.name &&
                t.oracleText === token.oracleText &&
                t.power === token.power &&
                t.toughness === token.toughness
            );
            if (existingTokens.length > 0) {
              existingTokens[0].tokenFor.push(pc.listedCard.card);
            } else {
              tokens.push({ ...token, tokenFor: [pc.listedCard.card] });
            }
          }
        }
      }
      setTokens(tokens);
    }
  }, [playerPickedCards]);

  return (
    <Row>
      {playerPickedCards && playerPickedCards.length >= POOLSIZE ? (
        <>
          <h2 className="icon-link">
            Your draft pool submission done{" "}
            <CheckSquareFill className="text-success" />
            <Button className="btn" onClick={resetPicked}>
              Reset picks
            </Button>
          </h2>
          <p>Waiting for other players to submit their draft pools.</p>
          {tokens.length > 0 && <DraftTokens tokens={tokens} />}
        </>
      ) : (
        <>
          <h2>Draft pool submission</h2>
          {photoUrl ? (
            <CardPool
              cubeCards={cube.cardlist.cards}
              cubeId={cube.id}
              photoUrl={photoUrl}
              seat={seat}
              setPlayerPickedCards={setPlayerPickedCards}
              POOLSIZE={POOLSIZE}
            />
          ) : (
            <Col className="d-grid gap-2">
              <p>
                After the draft, please submit a photo showing all the cards you
                drafted. Make sure the names of all cards are visible.
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
