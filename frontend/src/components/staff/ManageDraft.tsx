import { Button, Col, Container, Row } from "react-bootstrap";
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
import DraftTable from "./DraftTable";
import DeckBuildingModal, { DeckBuildingModalProps } from "./DeckBuildingModal";
import DecksSubmittedProgressBar from "./DecksSubmittedProgressBar";
import CardCountupTimer from "../general/CardCountupTimer";
import { Link } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";
import { Enrollment } from "../../types/User";

type Props = {
  currentDraft: Draft;
  enrollments: Enrollment[];
  setCurrentDraft: (draft?: Draft) => void;
  setCurrentRound: (round: Round) => void;
};

const ManageDraft = ({
  currentDraft,
  enrollments,
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
  const [poolsReturned, setPoolsReturned] = useState<number>(0);
  const [draftStart, setDraftStart] = useState<Dayjs>();
  const [draftTimerStarted, setDraftTimerStarted] = useState<boolean>(false);
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
      a.seat === b.seat
        ? (a.pod?.podNumber ?? 0) - (b.pod?.podNumber ?? 0)
        : a.seat - b.seat,
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
          .find((round) => round.status === "pending"),
      );

      setLastCompletedRound(
        rounds
          .sort((a, b) => b.roundNumber - a.roundNumber)
          .find((round) => round.status === "completed"),
      );
    };

    fetchData();
  }, [currentDraft.id]);

  const generatePairings = async () => {
    const resp = await put(
      `/tournament/${tournamentId}/draft/${currentDraft.id}/round/${firstPendingRound?.id}/pairings`,
    );
    const matches = (await resp.json()) as Match[];
    if (matches !== null) {
      toast.success(
        "Pairings for round " + firstPendingRound?.roundNumber + " generated",
      );
      setFirstPendingRound({ ...firstPendingRound!, matches });
    }

    // todo: response should return a Round so we can setCurrentRound() and instantly update the view
    // const round = (await resp.json()) as Round;
    // setCurrentRound(round);
  };

  const startRound = async () => {
    if (firstPendingRound) {
      const response = await put(
        `/tournament/${tournamentId}/round/${firstPendingRound?.id}/start`,
        {},
      );
      const round = (await response.json()) as Round;
      setCurrentRound(round);
    }
  };

  const startDraft = async () => {
    if (currentDraft) {
      const response = await put(
        `/tournament/${tournamentId}/draft/${currentDraft.id}/start`,
        {},
      );
      const draft = (await response.json()) as Draft;
      if (draft !== null) {
        toast.success("Draft timer started");
        setCurrentDraft(draft);
      }
    }
  };

  const completeDraft = async () => {
    const response = await put(
      `/tournament/${tournamentId}/draft/${currentDraft.id}/end`,
      {},
    );
    const updatedTournament = (await response.json()) as Tournament;
    console.log(updatedTournament);
    toast.success("Draft completed");
    setCurrentDraft(undefined);
    // do some stuff here
  };

  useEffect(() => {
    if (allSeats) {
      setBuildingRemaining(
        allSeats.filter((seat) => seat.deckPhotoUrl == null).length,
      );
    }
  }, [allSeats]);

  function markDone(seat: DraftPodSeat) {
    if (seat) {
      const seatId = seat.id;
      post(`/tournament/${tournamentId}/setDeckPhoto/${seatId}`, {
        tournamentId,
        seatId,
      }).then(async (resp) => {
        const draft = (await resp.json()) as Draft;
        if (draft !== null) {
          // console.log(draft);
          toast.success(
            "Marked done for " +
              seat.player?.firstName +
              " " +
              seat.player?.lastName,
          );
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
      heading: "Confirm draft pool submission",
      text:
        "Are you sure you want to confirm draft pool submitted for: " +
        clickedSeat.player?.firstName +
        " " +
        clickedSeat.player?.lastName,
      actionText: "Confirm submitted",
      actionFunction: markDone,
      seat: clickedSeat,
    });
  }

  useEffect(() => {
    if (allSeats) {
      setPoolsReturned(
        allSeats.filter((seat) => seat.draftPoolReturned === true).length,
      );
    }
  }, [allSeats]);

  useEffect(() => {
    if (!currentDraft.startTime) {
      // not started yet
    } else {
      setDraftStart(dayjs(currentDraft.startTime));
      setDraftTimerStarted(true);
    }
  }, [currentDraft]);

  if (currentDraft) {
    return (
      <>
        {lastCompletedRound?.roundNumber === currentDraft.lastRound ? (
          <Row>
            <h3>Round {lastCompletedRound.roundNumber} complete.</h3>
            <h3>Draft {currentDraft.draftNumber} over.</h3>
            <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
              <Button
                variant="info"
                className="btn-lg text-light"
                onClick={() => completeDraft()}
                disabled={poolsReturned < totalPlayers}
              >
                Complete draft
              </Button>
              {poolsReturned < totalPlayers && (
                <p className="small text-center">
                  All draft pools need to be returned before the draft can be
                  complete.
                </p>
              )}
            </Col>
            <Col xs={12} className="mt-3">
              <h3>
                Draft pools returned: {poolsReturned}/{totalPlayers}
              </h3>
            </Col>
            <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
              <Link
                className="btn btn-info btn-lg text-light"
                to={`/tournament/${tournamentId}/pools/${currentDraft.id}`}
              >
                Manage draft pools
              </Link>
            </Col>
          </Row>
        ) : firstPendingRound ? (
          <>
            <Row>
              <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
                {(firstPendingRound.matches ?? []).length ? (
                  <>
                    <Button
                      variant="info"
                      className="btn-lg text-light"
                      onClick={() => startRound()}
                    >
                      Start round {firstPendingRound.roundNumber}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="info"
                      className="btn-lg text-light"
                      onClick={() => generatePairings()}
                      disabled={buildingRemaining > 0}
                    >
                      Generate pairings (round {firstPendingRound.roundNumber})
                    </Button>
                    {!lastCompletedRound && buildingRemaining !== 0 && (
                      <p className="small text-center">
                        You can only generate pairings once all players have
                        submitted their draft pools
                      </p>
                    )}
                  </>
                )}
              </Col>
              <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
                {!draftTimerStarted && (
                  <Button
                    variant="info"
                    className="btn-lg text-light"
                    onClick={() => startDraft()}
                  >
                    Start draft timer
                  </Button>
                )}
              </Col>
            </Row>
            {!(firstPendingRound.matches ?? []).length &&
              (lastCompletedRound?.roundNumber ?? 0) <
                currentDraft.firstRound && (
                <>
                  <Row className="mt-3">
                    <Container>
                      <CardCountupTimer
                        started={draftTimerStarted}
                        startTime={draftStart ? draftStart : dayjs()}
                      />
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
                    enrollments={enrollments}
                    markDoneClicked={markDoneClicked}
                    draftTimerStarted={draftTimerStarted}
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
