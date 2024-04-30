import { useState, useContext, useEffect } from "react";
import { UserInfoContext } from "../provider/UserInfoProvider";
import { post } from "../../services/ApiService";
import { get } from "../../services/ApiService";
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
import { Player } from "../../types/User";
import HorizontalCard from "../general/HorizontalCard";
import HelmetTitle from "../general/HelmetTitle";
import { toast } from "react-toastify";
import DraftPoolButton from "../general/DraftPoolButton";

type Props = {
  tournament: Tournament;
  draft: Draft;
  round: Round;
  match: Match;
  setCurrentMatch: (match: Match) => void;
};

function RoundOngoing({
  tournament,
  draft,
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
  const [player, setPlayer] = useState<Player>();
  const [opponent, setOpponent] = useState<Player>();
  const [roundTimerStarted, setRoundTimerStarted] = useState<boolean>(false);
  const [playerTournamentScore, setPlayerTournamentScore] =
    useState<PlayerTournamentScore>();
  const [currentRoundPoints, setCurrentRoundPoints] = useState<number>(0);
  const [draftPodSeat, setDraftPodSeat] = useState<DraftPodSeat>();

  useEffect(() => {
    // check player id's from match and set correct player & opponent objects
    if (match && user) {
      if (match.player1.id === user?.id) {
        if (opponent?.id !== match.player2.id) {
          setPlayerRadioValue("0");
          setOpponentRadioValue("0");
        }
        setPlayer(match.player1);
        setOpponent(match.player2);
        if (match.resultSubmittedBy) {
          setPlayerRadioValue(match.player1GamesWon.toString());
          setOpponentRadioValue(match.player2GamesWon.toString());
        }
      } else {
        if (opponent?.id !== match.player1.id) {
          setPlayerRadioValue("0");
          setOpponentRadioValue("0");
        }
        setPlayer(match.player2);
        setOpponent(match.player1);
        if (match.resultSubmittedBy) {
          setPlayerRadioValue(match.player2GamesWon.toString());
          setOpponentRadioValue(match.player1GamesWon.toString());
        }
      }
    }
  }, [match, user]);

  // handle result submission
  const submitResult = () => {
    const matchId = match.id;
    const roundId = round.id;
    const resultSubmittedBy = user?.id;
    const player1GamesWon =
      match.player1.id === user?.id ? playerRadioValue : opponentRadioValue;
    const player2GamesWon =
      match.player1.id === user?.id ? opponentRadioValue : playerRadioValue;
    post(`/submitResult`, {
      matchId,
      roundId,
      resultSubmittedBy,
      player1GamesWon,
      player2GamesWon,
    }).then(async (resp) => {
      // TODO receive match status, send it back to Ongoing component
      const updatedMatch = (await resp.json()) as Match;
      if (updatedMatch !== null) {
        setModal({
          ...modal,
          show: false,
        });
        setCurrentMatch({ ...match, ...updatedMatch });
        toast.success("Result submitted successfully");
      }
    });
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
      const response = await get(`/match/round/${round.id}`);
      const mtchs = await response.json();
      setMatches(mtchs);
    };
    const doFetch = () => {
      if (round) {
        fetchData();
      }
    };
    doFetch();
    const roundInterval = setInterval(doFetch, 10000);

    // return destructor function from useEffect to clear the interval pinging
    return () => {
      clearInterval(roundInterval);
    };
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
      const response = await get(
        `/tournament/${tournament.id}/score/${user?.id}`
      );
      const score = await response.json();
      setPlayerTournamentScore(score);
    };

    fetchData();
  }, [user]);

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
          if (seat.player.id === user.id) {
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
              {/* {player.id === onThePlay && <> (plays first)</>} */}
            </h2>
          </Col>
          <Col xs={12} className="text-center">
            <h2>vs.</h2>
          </Col>
          <Col xs={12} className="text-center">
            <h2>
              {opponent.firstName} {opponent.lastName}
              {/* {opponent.id === onThePlay && <> (plays first)</>} */}
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
