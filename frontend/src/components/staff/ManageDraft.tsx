import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import {
  Draft,
  DraftPodSeat,
  Match,
  Round,
  Tournament,
} from "../../types/Tournament";
import { useEffect, useState } from "react";
import { get, post, put } from "../../services/ApiService";
import { useParams } from "react-router";
import CardCountdownTimer from "../general/CardCountdownTimer";
import DraftTable from "./DraftTable";

import DeckBuildingModal, { DeckBuildingModalProps } from "./DeckBuildingModal";
import DecksSubmittedProgressBar from "./DecksSubmittedProgressBar";

type Props = {
  currentDraft: Draft;
  setCurrentDraft: (draft?: Draft) => void;
  setCurrentRound: (round: Round) => void;
};

const ManageDraft = ({
  currentDraft,
  setCurrentDraft,
  setCurrentRound,
}: Props) => {
  // get rounds for this draft, look at their statuses and matches generated
  // find last completed round and first pending round
  // if last round completed == draft last round, draft is over
  // else if next round pending has no matches, we need to generate pairings
  // if next round pending DOES have matches, we can start the round
  // when round is started, set current round in StaffView (check NextDraft)
  const { tournamentId } = useParams();
  const [lastCompletedRound, setLastCompletedRound] = useState<Round>();
  const [firstPendingRound, setFirstPendingRound] = useState<Round>();
  const [allSeats, setAllSeats] = useState<DraftPodSeat[]>([]);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [buildingRemaining, setBuildingRemaining] = useState<number>(0);
  const [modal, setModal] = useState<DeckBuildingModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
    seat: {} as DraftPodSeat,
  });

  useEffect(() => {
    const seats: DraftPodSeat[] = [];
    for (let i = 0; i < currentDraft.pods.length; i++) {
      const pod = currentDraft.pods[i];
      for (let j = 0; j < pod.seats.length; j++) {
        const seat = pod.seats[j];
        seats.push({ ...seat, pod });
      }
    }
    seats.sort((a, b) =>
      a.seat === b.seat ? a.pod.podNumber - b.pod.podNumber : a.seat - b.seat
    );
    setAllSeats(seats);
    if (totalPlayers === 0) {
      setTotalPlayers(seats.length);
    }
  }, [currentDraft]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/draft/${currentDraft.id}/rounds`);
      const rounds: Round[] = ((await resp.json()) ?? []) as Round[];

      // console.log("rounds", JSON.stringify(rounds, null, 2));

      setFirstPendingRound(
        rounds
          .sort((a, b) => a.roundNumber - b.roundNumber)
          .find((round) => round.status === "pending")
      );

      setLastCompletedRound(
        rounds
          .sort((a, b) => b.roundNumber - a.roundNumber)
          .find((round) => round.status === "completed")
      );
    };

    fetchData();
  }, [currentDraft.id]);

  const generatePairings = async () => {
    const resp = await put(
      `/tournament/${tournamentId}/draft/${currentDraft.id}/round/${firstPendingRound?.id}/pairings`
    );
    const matches = (await resp.json()) as Match[];
    setFirstPendingRound({ ...firstPendingRound!, matches });
  };

  const startRound = async () => {
    if (firstPendingRound) {
      const response = await put(
        `/tournament/${tournamentId}/round/${firstPendingRound?.id}/start`,
        {}
      );
      const round = (await response.json()) as Round;
      setCurrentRound(round);
    }
  };

  const completeDraft = async () => {
    const response = await put(
      `/tournament/${tournamentId}/draft/${currentDraft.id}/end`,
      {}
    );
    const updatedTournament = (await response.json()) as Tournament;
    console.log(updatedTournament);
    setCurrentDraft(undefined);
    // do some stuff here
  };

  useEffect(() => {
    if (allSeats) {
      setBuildingRemaining(
        allSeats.filter((seat) => seat.deckPhotoUrl == null).length
      );
    }
  }, [allSeats]);

  function markDone(seat: DraftPodSeat) {
    if (seat) {
      const seatId = seat.id;
      post(`/setDeckPhoto`, {
        tournamentId,
        seatId,
      }).then(async (resp) => {
        const draft = (await resp.json()) as Draft;
        if (draft !== null) {
          console.log(draft);
          setCurrentDraft(draft);
          setModal({
            ...modal,
            show: false,
          });
        }
      });
    } else {
      console.log("error");
    }
  }

  function markDoneClicked(clickedSeat: DraftPodSeat) {
    setModal({
      show: true,
      onHide: () => null,
      heading: "Confirm deck building complete",
      text:
        "Are you sure you want to confirm deck building complete for: " +
        clickedSeat.player.firstName +
        " " +
        clickedSeat.player.lastName,
      actionText: "Confirm complete",
      actionFunction: markDone,
      seat: clickedSeat,
    });
  }

  if (currentDraft) {
    return (
      <>
        <Row>
          <Col xs={12}>
            <p>
              Last completed round: {lastCompletedRound?.roundNumber ?? "N/A"}
            </p>
            <p>Next pending round: {firstPendingRound?.roundNumber ?? "N/A"}</p>
            <p>
              Which rounds: {currentDraft.firstRound} - {currentDraft.lastRound}
            </p>
          </Col>
        </Row>

        {lastCompletedRound?.roundNumber === currentDraft.lastRound ? (
          <Row>
            <h3>The draft is over.</h3>
            <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
              <Button
                variant="primary"
                className="btn-lg"
                onClick={() => completeDraft()}
              >
                Complete draft
              </Button>
            </Col>
          </Row>
        ) : firstPendingRound ? (
          <>
            <Row>
              <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
                {firstPendingRound.matches.length ? (
                  <>
                    {firstPendingRound.roundNumber ===
                      currentDraft.firstRound && (
                      <Alert variant="success" className="fs-5 text-center">
                        Deck building complete
                      </Alert>
                    )}
                    <Button
                      variant="primary"
                      className="btn-lg"
                      onClick={() => startRound()}
                    >
                      Start next round
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      className="btn-lg"
                      onClick={() => generatePairings()}
                      disabled={buildingRemaining > 0}
                    >
                      Generate pairings
                    </Button>
                    <p className="small text-center">
                      you can only generate pairings once deckbuilding is
                      complete for all players
                    </p>
                  </>
                )}
              </Col>
            </Row>
            {!firstPendingRound.matches.length &&
              (lastCompletedRound?.roundNumber ?? 0) <
                currentDraft.firstRound && (
                <>
                  <Row className="mt-3">
                    <Container>
                      <CardCountdownTimer initialSeconds={42} />
                      <Col xs={12}>
                        <DecksSubmittedProgressBar
                          remainingSubmissions={buildingRemaining}
                          totalPlayers={totalPlayers}
                        />
                      </Col>
                    </Container>
                  </Row>
                  <DraftTable
                    seats={allSeats}
                    markDoneClicked={markDoneClicked}
                  />
                  <DeckBuildingModal
                    show={modal.show}
                    onHide={() =>
                      setModal({
                        ...modal,
                        show: false,
                      })
                    }
                    heading={modal.heading}
                    text={modal.text}
                    actionText={modal.actionText}
                    actionFunction={modal.actionFunction}
                    seat={modal.seat}
                  />
                </>
              )}
          </>
        ) : (
          <p>Something's wrong, there are no rounds generated for this draft</p>
        )}
      </>
    );
  }
};

export default ManageDraft;
