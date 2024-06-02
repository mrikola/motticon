import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Draft, DraftPodSeat } from "../../types/Tournament";
import { postFormData } from "../../services/ApiService";
import { CheckSquareFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import CardPool from "./CardPool";
import { Cube } from "../../types/Cube";
import { PickedCard, Token } from "../../types/Card";

type Props = {
  seat: DraftPodSeat;
  cube: Cube;
  photoUrl: string | undefined;
  tournamentId: number;
  done: boolean;
  setDraft: (draft: Draft) => void;
  playerPickedCards: PickedCard[];
  setPlayerPickedCards: (cards: PickedCard[]) => void;
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

  // const resetPicked = async () => {
  //   console.log("attempting to reset picks");
  //   const response = await get(
  //     `/cube/${cube.id}/pickedCards/return/${seat.id}`
  //   );
  //   const success = (await response.json()) as boolean;
  //   console.log(success);
  // };

  useEffect(() => {
    const tokens: Token[] = [];
    // console.log(playerPickedCards);
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
    console.log(tokens);
  }, [playerPickedCards]);

  return (
    <Row>
      {done && playerPickedCards ? (
        <>
          <h2 className="icon-link">
            Your draft pool submission done{" "}
            <CheckSquareFill className="text-success" />
          </h2>
          <p>Waiting for other players to submit their draft pools.</p>
          {tokens.length > 0 && (
            <Col xs={12}>
              <p className="lead">Remember to pick up these tokens:</p>
              <Row>
                {tokens.map((token, index) => (
                  <Col xs={4} className="mb-3" key={index}>
                    <p>
                      {token.power && (
                        <>
                          {token.power}/{token.toughness}{" "}
                        </>
                      )}
                      {token.name}
                    </p>
                    <img
                      key={index}
                      className="cube-token"
                      src={`https://cards.scryfall.io/normal/front/${token.scryfallId.charAt(
                        0
                      )}/${token.scryfallId.charAt(1)}/${token.scryfallId}.jpg`}
                    />
                    {token.tokenFor.map((tokenGenerator) => (
                      <p key={tokenGenerator.id} className="small">
                        {tokenGenerator.name}
                      </p>
                    ))}
                  </Col>
                ))}
              </Row>
            </Col>
          )}
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
