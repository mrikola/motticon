import { useContext, useEffect, useState } from "react";
import { Match, Round } from "../../types/Tournament";
import dayjs, { Dayjs } from "dayjs";
import ResultsInputModal, { ModalProps } from "../general/ResultsInputModal";
import { Player } from "../../types/User";
import { get, post, put } from "../../services/ApiService";
import { UserInfoContext } from "../provider/UserInfoProvider";
import { Button, Col, Container, Row } from "react-bootstrap";
import CardCountdownTimer from "../general/CardCountdownTimer";
import MatchesRemainingProgressBar from "../general/MatchesRemainingProgressBar";
import MatchTable from "./MatchTable";
import { useParams } from "react-router";
import VerticallyCenteredModal, {
  VerticallyCenteredModalProps,
} from "../general/VerticallyCenteredModal";
import HorizontalCard from "../general/HorizontalCard";
import { toast } from "react-toastify";

type Props = {
  currentRound: Round;
  setCurrentRound: (round?: Round) => void;
};

const ManageRound = ({ currentRound, setCurrentRound }: Props) => {
  const user = useContext(UserInfoContext);
  const { tournamentId } = useParams();
  const [timeRemaining, setTimeRemaining] = useState<number>(3000);
  const [matches, setMatches] = useState<Match[]>();
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [roundStart, setRoundStart] = useState<Dayjs>();
  const [roundTimerStarted, setRoundTimerStarted] = useState<boolean>(false);
  const [modal, setModal] = useState<ModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    actionFunction: () => {},
    match: {
      id: 1,
      tableNumber: 1,
      player1GamesWon: 0,
      player2GamesWon: 0,
      player1: {} as Player,
      player2: {} as Player,
      resultSubmittedBy: {} as Player,
      playerGoingFirst: {} as Player,
    },
  });
  const [endRoundModal, setEndRoundModal] =
    useState<VerticallyCenteredModalProps>({
      show: false,
      onHide: () => null,
      heading: "",
      text: "",
      actionText: "",
      actionFunction: () => {},
    });

  useEffect(() => {
    if (dayjs(currentRound.startTime).isSame(dayjs(dayjs().unix()), "year")) {
      // temporary fix, as startTime is Unix epoch if not set
    } else {
      setRoundStart(dayjs(currentRound.startTime));
      setRoundTimerStarted(true);
    }
  }, [currentRound]);

  const startRound = async () => {
    if (currentRound) {
      const response = await put(
        `/tournament/${tournamentId}/round/${currentRound.id}/start`,
        {}
      );
      const round = (await response.json()) as Round;
      if (round !== null) {
        toast.success("Round timer started");
        setCurrentRound(round);
      }
    }
  };

  useEffect(() => {
    if (roundTimerStarted && roundStart) {
      const now = dayjs();
      const endTime = roundStart.add(50, "m");
      const diff = endTime.diff(now, "second");
      setTimeRemaining(diff);
    }
  }, [roundStart, timeRemaining, roundTimerStarted]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/match/round/${currentRound?.id}`);
      const mtchs = (await response.json()) as Match[];
      // sort by table number, descending
      mtchs.sort((a, b) => (a.tableNumber > b.tableNumber ? 1 : -1));
      setMatches(mtchs);
      // console.log(mtchs);
    };

    const doFetch = () => {
      if (currentRound) {
        fetchData();
      }
    };

    doFetch();
    const roundInterval = setInterval(doFetch, 10000);

    // return destructor function from useEffect to clear the interval pinging
    return () => {
      clearInterval(roundInterval);
    };
  }, [currentRound]);

  useEffect(() => {
    if (matches) {
      setTotalMatches(matches.length);
    }
  }, [matches]);

  const [resultsMissing, setResultsMissing] = useState<number>(0);

  useEffect(() => {
    if (matches) {
      setResultsMissing(
        matches.filter((match) => !match.resultSubmittedBy).length
      );
    }
  }, [matches]);

  function submitResult(
    match: Match,
    player1GamesWon: string,
    player2GamesWon: string
  ) {
    const matchId = match.id;
    const resultSubmittedBy = user?.id;
    const roundId = currentRound?.id;
    post(`/staff/tournament/${tournamentId}/submitResult`, {
      roundId,
      matchId,
      resultSubmittedBy,
      player1GamesWon,
      player2GamesWon,
    }).then(async (resp) => {
      const jwt = (await resp.json()) as Match[];
      if (jwt !== null) {
        toast.success("Result for table " + match.tableNumber + " submitted");
        setMatches(
          jwt.sort((a, b) => (a.tableNumber > b.tableNumber ? 1 : -1))
        );
        setModal({
          ...modal,
          show: false,
        });
      }
    });
  }

  function submitResultClicked(clickedMatch: Match) {
    setModal({
      show: true,
      onHide: () => null,
      heading: "Submit result",
      actionFunction: submitResult,
      match: clickedMatch,
    });
  }

  function editResultClicked(clickedMatch: Match) {
    setModal({
      show: true,
      onHide: () => null,
      heading: "Edit result",
      actionFunction: submitResult,
      match: clickedMatch,
    });
  }

  const endRound = async () => {
    const response = await put(
      `/tournament/${tournamentId}/round/${currentRound.id}/end`,
      {}
    );

    if (response.status === 200 || response.status === 204) {
      // round ended successfully, tell the tournament there is no round
      toast.success("Round ended");
      setCurrentRound(undefined);
    }
  };

  function handleEndRoundClick() {
    setEndRoundModal({
      show: true,
      onHide: () => null,
      heading: "Confirm round end",
      text: "Are you sure you want to end this round?",
      actionText: "Confirm round end",
      actionFunction: endRound,
    });
  }

  if (user && currentRound && timeRemaining && matches) {
    return (
      <>
        <Row>
          <Container>
            <HorizontalCard
              squareFillContent={currentRound.roundNumber.toString()}
              cardTitle="Round number"
            />
            <CardCountdownTimer
              initialSeconds={timeRemaining}
              started={roundTimerStarted}
            />
            <Col xs={12}>
              <MatchesRemainingProgressBar
                remainingMatches={resultsMissing}
                totalMatches={totalMatches}
              />
            </Col>
          </Container>
        </Row>
        <Row>
          <Col xs={10} sm={8} className="d-grid gap-2 mx-auto my-3">
            {!roundTimerStarted ? (
              <Button
                variant="primary"
                className="btn-lg"
                onClick={() => startRound()}
              >
                Start next round
              </Button>
            ) : (
              <Button
                variant="primary"
                className="btn-lg"
                disabled={resultsMissing > 0}
                aria-disabled={resultsMissing > 0}
                onClick={() => handleEndRoundClick()}
              >
                End round
              </Button>
            )}
          </Col>
        </Row>
        <MatchTable
          matches={matches}
          submitResultClicked={submitResultClicked}
          editResultClicked={editResultClicked}
          roundTimerStarted={roundTimerStarted}
        />
        <VerticallyCenteredModal
          show={endRoundModal.show}
          onHide={() =>
            setEndRoundModal({
              ...endRoundModal,
              show: false,
            })
          }
          heading={endRoundModal.heading}
          text={endRoundModal.text}
          actionText={endRoundModal.actionText}
          actionFunction={endRoundModal.actionFunction}
        />
        <ResultsInputModal
          show={modal.show}
          onHide={() =>
            setModal({
              ...modal,
              show: false,
            })
          }
          heading={modal.heading}
          actionFunction={modal.actionFunction}
          match={modal.match}
        />
      </>
    );
  }
};

export default ManageRound;
