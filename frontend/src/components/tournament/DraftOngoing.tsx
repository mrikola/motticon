import { useContext, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import {
  Draft,
  DraftPod,
  DraftPodSeat,
  Tournament,
} from "../../types/Tournament";
import { UserInfoContext } from "../provider/UserInfoProvider";
import DeckBuildingSubmission from "./DeckBuildingSubmission";
import DecksSubmittedProgressBar from "../staff/DecksSubmittedProgressBar";
import HorizontalCard from "../general/HorizontalCard";
import HorizontalIconCard from "../general/HorizontalIconCard";
import HelmetTitle from "../general/HelmetTitle";
import { Cube } from "../../types/Cube";
import { PickedCard } from "../../types/Card";
import { ApiClient, ApiException } from "../../services/ApiService";
import { startPolling } from "../../utils/polling";

type Props = {
  tournament: Tournament;
  draft: Draft;
  setDraft: (draft: Draft) => void;
};

type DeckBuildingDto = {
  seat: number;
  pickedCards: PickedCard[];
};

function DraftOngoing({ tournament, draft, setDraft }: Props) {
  const user = useContext(UserInfoContext);
  const [playerCube, setPlayerCube] = useState<Cube>();
  const [playerPod, setPlayerPod] = useState<DraftPod>();
  const [playerSeat, setPlayerSeat] = useState<DraftPodSeat>();
  const [playerPoolPhotoUrl, setPlayerPoolPhotoUrl] = useState<string>();
  const [deckBuildingDone, setDeckBuildingDone] = useState<boolean>(false);
  const [buildingRemaining, setBuildingRemaining] = useState<number>(0);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [playerPickedCards, setPlayerPickedCards] = useState<PickedCard[]>([]);
  const [_deckBuildingStatus, setDeckBuildingStatus] = useState<
    DeckBuildingDto[]
  >([]);
  const POOLSIZE = 45;

  // get relevant draft info and cube data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const draftPod = await ApiClient.getDraftPodForUser(draft.id, user?.id ?? 0);
        setPlayerPod(draftPod);
        setPlayerSeat(draftPod.seats[0]);
        setPlayerPoolPhotoUrl(draftPod.seats[0].deckPhotoUrl ?? undefined);

        // Fetch cube data if we don't have it yet
        if (!playerCube) {
          const cube = await ApiClient.getCubeById(draftPod.cube.id);
          setPlayerCube(cube);
        }
      } catch (error) {
        if (error instanceof ApiException) {
          console.error('Failed to fetch draft data:', error.message);
        }
      }
    };

    if (user && draft) {
      return startPolling(() => fetchData());
    }
  }, [user, draft, playerCube]);

  // Process picked cards and update deck building status
  useEffect(() => {
    if (playerPod && playerSeat) {
      // iterate over cards in cube and check if there are picked cards assigned to user (via seat number)
      const pickedCards: PickedCard[] = [];
      for (const card of playerPod.cube.cardlist?.cards ?? []) {
        if (card.pickedCards.length > 0) {
          for (const pickedCard of card.pickedCards) {
            if (pickedCard.picker.seat === playerSeat?.seat) {
              pickedCards.push(pickedCard);
            }
          }
        }
      }
      setPlayerPickedCards(pickedCards);

      // mark deck building done when user has POOLSIZE or more cards registered to them
      setDeckBuildingDone(pickedCards.length >= POOLSIZE);

      // get other seats for progress bar
      const seats: DraftPodSeat[] = [];
      for (const pod of draft.pods) {
        seats.push(...pod.seats);
      }
      
      if (totalPlayers === 0) {
        setTotalPlayers(seats.length);
      }

      // Calculate deck building status for all seats
      const deckBuilding = seats.map(seat => ({
        seat: seat.seat,
        pickedCards: playerPod.cube.cardlist?.cards
          .flatMap(card => card.pickedCards)
          .filter(pc => pc.picker.seat === seat.seat) ?? []
      }));
      
      setDeckBuildingStatus(deckBuilding);

      // update progress bar based on number of players done building
      setBuildingRemaining(
        deckBuilding.filter((seat) => seat.pickedCards.length < POOLSIZE)
          .length
      );
    }
  }, [playerPod, playerSeat, draft.pods, POOLSIZE, totalPlayers]);

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
          POOLSIZE={POOLSIZE}
        />
      </>
    );
  }
}

export default DraftOngoing;
