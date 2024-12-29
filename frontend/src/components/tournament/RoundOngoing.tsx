import { useState, useContext, useEffect } from "react";
import { UserInfoContext } from "../provider/UserInfoProvider";
import { Button, Col, Container, Row } from "react-bootstrap";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import MatchesRemainingProgressBar from "../general/MatchesRemainingProgressBar";
import MatchResultRadioButtons from "../general/MatchResultRadioButtons";
import {
  Draft,
  DraftPodSeat,
  Match,
  PlayerTournamentScore,
  Round,
  Tournament,
} from "../../types/Tournament";
import VerticallyCenteredModal, {
  VerticallyCenteredModalProps,
} from "../general/VerticallyCenteredModal";
import { Enrollment, Player } from "../../types/User";
import HorizontalCard from "../general/HorizontalCard";
import HelmetTitle from "../general/HelmetTitle";
import { toast } from "react-toastify";
import DraftPoolButton from "../general/DraftPoolButton";
import { isPlayerDropped } from "../../utils/user";
import { ApiClient, ApiException } from "../../services/ApiService";
import { startPolling } from "../../utils/polling";

type Props = {
  tournament: Tournament;
  draft: Draft;
  enrollments: Enrollment[];
  round: Round;
  match: Match;
  setCurrentMatch: (match: Match) => void;
};

function RoundOngoing({
  tournament,
  draft,
  enrollments,
  round,
  match,
  setCurrentMatch,
}: Props) {
  const [timeRemaining, setTimeRemaining] = useState<number>();
  const user = useContext(UserInfoContext);
  const [roundStartTime, _setRoundStartTime] = useState<Dayjs>();
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [matches, setMatches] = useState<Match[]>();
  const [playerRadioValue, setPlayerRadioValue] = useState<string>();
  const [opponentRadioValue, setOpponentRadioValue] = useState<string>();
  const [modal, setModal] = useState<VerticallyCenteredModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
    variant: "primary",
  });
  const [onThePlay, setOnThePlay] = useState<number>();
  const [player, setPlayer] = useState<Player>();
  const [opponent, setOpponent] = useState<Player>();
  const [roundTimerStarted, setRoundTimerStarted] = useState<boolean>(false);
  const [playerTournamentScore, setPlayerTournamentScore] =
    useState<PlayerTournamentScore>();
  const [currentRoundPoints, setCurrentRoundPoints] = useState<number>(0);
  const [draftPodSeat, setDraftPodSeat] = useState<DraftPodSeat>();
  const [opponentDropped, setOpponentDropped] = useState<boolean>(false);

  useEffect(() => {
    if (!match || !user) return;

    const isPlayer1 = match.player1.id === user?.id;   
    const currentPlayer = isPlayer1 ? match.player1 : match.player2;
    const currentOpponent = isPlayer1 ? match.player2 : match.player1;
    
    setOnThePlay(match.playerGoingFirst?.id);
    setPlayer(currentPlayer);
    setOpponent(currentOpponent);
    setOpponentDropped(isPlayerDropped(enrollments, currentOpponent.id));

    if (match.resultSubmittedBy) {
      setPlayerRadioValue(isPlayer1 ? match.player1GamesWon.toString() : match.player2GamesWon.toString());
      setOpponentRadioValue(isPlayer1 ? match.player2GamesWon.toString() : match.player1GamesWon.toString());
    } else if (opponent?.id !== currentOpponent.id) {
      // Reset radio values when opponent changes
      setPlayerRadioValue("0");
      setOpponentRadioValue("0");
    }
  }, [match, user, enrollments, opponent]);

  // handle result submission
  const submitResult = async () => {
    try {
      const updatedMatch = await ApiClient.submitMatchResult({
        matchId: match.id,
        roundId: round.id,
        resultSubmittedBy: user?.id ?? 0,
        player1GamesWon: match.player1.id === user?.id ? playerRadioValue! : opponentRadioValue!,
        player2GamesWon: match.player1.id === user?.id ? opponentRadioValue! : playerRadioValue!
      });

      setModal({
        ...modal,
        show: false,
      });
      setCurrentMatch({ ...match, ...updatedMatch });
      toast.success("Result submitted successfully");
    } catch (error) {
      if (error instanceof ApiException) {
        toast.error('Failed to submit result: ' + error.message);
      }
    }
  };

  // set modal information when user clicks "submit"
  function handleSubmitClicked() {
    setModal({
      show: true,
      onHide: () => null,
      heading: "Confirm result",
      text: "You submitted:",
      text2:
        user?.firstName +
        " " +
        user?.lastName +
        " " +
        playerRadioValue +
        " – " +
        opponentRadioValue +
        " " +
        opponent!.firstName +
        " " +
        opponent!.lastName,
      text3: "Is this correct?",
      actionText: "Confirm result",
      actionFunction: submitResult,
      variant: "primary",
    });
  }

  useEffect(() => {
    if (dayjs(round.startTime).isSame(dayjs(dayjs().unix()), "year")) {
      // temporary fix, as startTime is Unix epoch if not set
      // set empty 50:00 clock
      setTimeRemaining(3000);
    } else {
      _setRoundStartTime(dayjs(round.startTime));
      setRoundTimerStarted(true);
    }
  }, [user, round]);

  // timer
  useEffect(() => {
    if (roundTimerStarted && roundStartTime) {
      const now = dayjs();
      const endTime = roundStartTime.add(50, "m");
      const diff = endTime.diff(now, "second");
      setTimeRemaining(diff);
    }
  }, [user, roundStartTime, timeRemaining, roundTimerStarted, round]);

  // get all matches for round (for progress bar)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mtchs = await ApiClient.getMatchesByRound(round.id);
        setMatches(mtchs);
      } catch (error) {
        if (error instanceof ApiException) {
          console.error('Failed to fetch matches:', error.message);
        }
      }
    };

    if (round) {
      return startPolling(() => fetchData());
    }
  }, [round]);

  // set total matches for progress bar
  useEffect(() => {
    if (matches) {
      setTotalMatches(matches.length);
    }
  }, [matches]);

  const [resultsMissing, setResultsMissing] = useState<number>(0);

  // ongoing matches for progress bar
  useEffect(() => {
    if (matches) {
      setResultsMissing(
        matches.filter((match) => !match.resultSubmittedBy).length
      );
    }
  }, [matches]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const score = await ApiClient.getPlayerTournamentScore(tournament.id, user?.id ?? 0);
        setPlayerTournamentScore(score);
      } catch (error) {
        if (error instanceof ApiException) {
          console.error('Failed to fetch score:', error.message);
        }
      }
    };

    fetchData();
  }, [tournament.id, user?.id]);

  useEffect(() => {
    if (match.resultSubmittedBy && playerRadioValue && opponentRadioValue) {
      if (playerRadioValue > opponentRadioValue) {
        setCurrentRoundPoints(3);
      }
    }
  }, [match]);

  // get pod info from draft-object rather than having to do extra backend call
  useEffect(() => {
    if (user) {
      Object.values(draft.pods).forEach((pod) => {
        Object.values(pod.seats).forEach((seat) => {
          if (seat.player?.id === user.id) {
            setDraftPodSeat(seat);
          }
        });
      });
    }
  }, [draft, user]);

  const submissionDisabled = !roundTimerStarted || !!match.resultSubmittedBy;

  if (user && timeRemaining && player && opponent && playerTournamentScore) {
    return (
      <>
        <HelmetTitle
          titleText={tournament.name + " Round " + round.roundNumber.toString()}
        />
        <Row>
          <Container>
            <HorizontalCard
              squareFillContent={(
                playerTournamentScore?.points + currentRoundPoints
              ).toString()}
              cardTitle="Your match points"
            />
            {match.resultSubmittedBy ? (
              <p className="small text-center">
                Including match points from round {round.roundNumber}.
              </p>
            ) : (
              <p className="small text-center">
                Points before round {round.roundNumber}, current match ongoing.
              </p>
            )}
            <h2 className="display-2">Round: {round.roundNumber}</h2>
            {roundTimerStarted ? (
              <>
                <h3>
                  Started: {dayjs(roundStartTime).format("HH:mm")}, ends:{" "}
                  {dayjs(roundStartTime).add(50, "m").format("HH:mm")}
                </h3>
              </>
            ) : (
              <h3>Round not started yet</h3>
            )}
            <HorizontalCard
              squareFillContent={match.tableNumber.toString()}
              cardTitle="Table"
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
          <Container></Container>
        </Row>
        <Row>
          <MatchResultRadioButtons
            name={"player-radio"}
            value={playerRadioValue ?? ""}
            updateFunction={setPlayerRadioValue}
            disabled={match.resultSubmittedBy ? true : false}
            variant="primary"
          />
          <Col xs={12} className="text-center">
            <h2>
              {player.firstName} {player.lastName}
              {player.id === onThePlay && <> (plays first)</>} 
            </h2>
          </Col>
          <Col xs={12} className="text-center">
            <h2>vs.</h2>
          </Col>
          <Col xs={12} className="text-center">
            <h2>
              {opponent.firstName} {opponent.lastName}{" "}
              {opponentDropped ? "(DROPPED)" : ""}
              {opponent.id === onThePlay && <> (plays first)</>} 
            </h2>
          </Col>
          <MatchResultRadioButtons
            name={"opponent-radio"}
            value={opponentRadioValue ?? ""}
            updateFunction={setOpponentRadioValue}
            disabled={match.resultSubmittedBy ? true : false}
            variant="primary"
          />
          <Col xs={12} className="d-grid gap-2 my-3">
            <Button
              variant="primary"
              className="btn-lg"
              type="submit"
              disabled={
                submissionDisabled || playerRadioValue === opponentRadioValue
              }
              aria-disabled={match.resultSubmittedBy ? true : false}
              onClick={() => handleSubmitClicked()}
            >
              {match.resultSubmittedBy ? "Result submitted" : "Submit result"}
            </Button>
          </Col>
          <hr></hr>
          {draftPodSeat && (
            <>
              <p>
                Remember to return your draft pool after the last round of the
                draft.
              </p>
              <Col xs={10} sm={8} className="d-grid gap-2 my-3 mx-auto">
                <DraftPoolButton seat={draftPodSeat} />
              </Col>
            </>
          )}
          <VerticallyCenteredModal
            show={modal.show}
            onHide={() =>
              setModal({
                ...modal,
                show: false,
              })
            }
            heading={modal.heading}
            text={modal.text}
            text2={modal.text2}
            text3={modal.text3}
            actionText={modal.actionText}
            actionFunction={modal.actionFunction}
            variant="primary"
          />
        </Row>
      </>
    );
  }
}

export default RoundOngoing;
