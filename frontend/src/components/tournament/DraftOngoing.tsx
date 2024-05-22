import { useContext, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import {
  Draft,
  DraftPod,
  DraftPodSeat,
  Tournament,
} from "../../types/Tournament";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../provider/UserInfoProvider";
import DeckBuildingSubmission from "./DeckBuildingSubmission";
import DecksSubmittedProgressBar from "../staff/DecksSubmittedProgressBar";
import HorizontalCard from "../general/HorizontalCard";
import HorizontalIconCard from "../general/HorizontalIconCard";
import HelmetTitle from "../general/HelmetTitle";
import { Cube, PickedCard } from "../../types/Cube";

type Props = {
  tournament: Tournament;
  draft: Draft;
  setDraft: (draft: Draft) => void;
};

function DraftOngoing({ tournament, draft, setDraft }: Props) {
  const user = useContext(UserInfoContext);
  const [playerCube, setPlayerCube] = useState<Cube>();
  const [playerPod, setPlayerPod] = useState<DraftPod>();
  const [playerSeat, setPlayerSeat] = useState<DraftPodSeat>();
  const [playerPoolPhotoUrl, setPlayerPoolPhotoUrl] = useState<string>();
  const [deckBuildingDone, setDeckBuildingDone] = useState<boolean>(false);
  const [buildingRemaining, setBuildingRemaining] = useState<number>(0);
  const [allSeats, setAllSeats] = useState<DraftPodSeat[]>([]);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [playerPickedCards, setPlayerPickedCards] = useState<PickedCard[]>([]);

  // get relevant draft info
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/draft/${draft.id}/user/${user?.id}`);
      const draftPod = (await response.json()) as DraftPod;
      setPlayerPod(draftPod);
      setPlayerSeat(draftPod.seats[0]);
      console.log("refreshed");
      console.log(draftPod);
      // need to set deckBuildingDone another way, not just looking at if pool photo exists
      // draftPod.seats[0].deckPhotoUrl
      //   ? setDeckBuildingDone(true)
      //   : setDeckBuildingDone(false);
      draftPod.seats[0].deckPhotoUrl
        ? setPlayerPoolPhotoUrl(draftPod.seats[0].deckPhotoUrl)
        : setPlayerPoolPhotoUrl(undefined);
    };
    const doFetch = () => {
      if (user && draft) {
        fetchData();
      }
    };

    doFetch();
    const roundInterval = setInterval(doFetch, 10000);

    // return destructor function from useEffect to clear the interval pinging
    return () => {
      clearInterval(roundInterval);
    };
  }, [user, draft]);

  useEffect(() => {
    if (!playerCube && playerPod) {
      const fetchData = async () => {
        const resp = await get(`/cube/${playerPod.cube.id}`);
        const cube = (await resp.json()) as Cube;
        setPlayerCube(cube);
      };
      fetchData();
    }
  }, [playerCube, playerPod]);

  // iterate over cards in cube and check if there are picked cards assigned to user (via seat number)
  useEffect(() => {
    if (playerPod && playerSeat && user && playerPickedCards.length === 0) {
      const pickedCards: PickedCard[] = [];
      for (const card of playerPod.cube.cardlist.cards) {
        if (card.pickedCards.length > 0) {
          for (const pickedCard of card.pickedCards) {
            if (pickedCard.picker.seat === playerSeat?.seat) {
              pickedCards.push(pickedCard);
            }
          }
        }
      }
      console.log(pickedCards);
      setPlayerPickedCards(pickedCards);
    }
  }, [playerPod, playerSeat]);

  // mark deck building done when user has 45 or more cards registered to them
  useEffect(() => {
    if (playerPickedCards.length >= 45) {
      setDeckBuildingDone(true);
    }
  }, [playerPickedCards]);

  // get other seats for progress bar
  useEffect(() => {
    const seats: DraftPodSeat[] = [];
    for (let i = 0; i < draft.pods.length; i++) {
      const pod = draft.pods[i];
      for (let j = 0; j < pod.seats.length; j++) {
        const seat = pod.seats[j];
        seats.push({ ...seat, pod });
      }
    }
    setAllSeats(seats);
    if (totalPlayers === 0) {
      setTotalPlayers(seats.length);
    }
  }, [draft, totalPlayers]);

  // update progress bar based on number of players done building
  useEffect(() => {
    if (allSeats) {
      // todo: change this to check PickedCard rather than deckPhotoUrl
      setBuildingRemaining(
        allSeats.filter((seat) => !seat.deckPhotoUrl).length
      );
    }
  }, [allSeats]);

  // callback function for modal once player confirms submit
  // function doneSetter(value: boolean) {
  //   setDeckBuildingDone(value);
  //   console.log("done set to: " + value);
  // }

  if (user && draft && playerPod && playerSeat && playerCube) {
    return (
      <>
        <HelmetTitle
          titleText={tournament.name + " Draft " + draft.draftNumber.toString()}
        />
        <Row>
          <h2 className="display-2">Draft: {draft.draftNumber}</h2>
        </Row>
        <Row>
          <Container>
            <HorizontalIconCard
              iconName="Box"
              cardTitle={playerPod.cube.title}
            />
            <HorizontalCard
              squareFillContent={playerPod.podNumber.toString()}
              cardTitle="Pod"
            />
            <HorizontalCard
              squareFillContent={playerSeat?.seat.toString()}
              cardTitle="Seat"
            />
          </Container>
        </Row>
        <DecksSubmittedProgressBar
          remainingSubmissions={buildingRemaining}
          totalPlayers={totalPlayers}
        />
        <DeckBuildingSubmission
          seat={playerSeat}
          cube={playerCube}
          photoUrl={playerPoolPhotoUrl}
          tournamentId={tournament.id}
          done={deckBuildingDone}
          setDraft={setDraft}
          setPlayerPickedCards={setPlayerPickedCards}
          playerPickedCards={playerPickedCards}
        />
      </>
    );
  }
}

export default DraftOngoing;
