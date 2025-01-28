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
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [_deckBuildingStatus, setDeckBuildingStatus] = useState<
    DeckBuildingDto[]
  >([]);
  const POOLSIZE = 45;

  // Poll draft pod data
  useEffect(() => {
    const fetchDraftPod = async () => {
      try {
        const draftPod = await ApiClient.getDraftPodForUser(
          draft.id,
          user?.id ?? 0
        );
        setPlayerPod(draftPod);
        setPlayerSeat(draftPod.seats[0]);
        setPlayerPoolPhotoUrl(draftPod.seats[0].deckPhotoUrl ?? undefined);
      } catch (error) {
        if (error instanceof ApiException) {
          console.error("Failed to fetch draft pod:", error.message);
        }
      }
    };

    if (user && draft) {
      return startPolling(() => fetchDraftPod());
    }
  }, [user, draft]);

  // One-time cube fetch
  useEffect(() => {
    const fetchCube = async () => {
      if (!playerCube && playerPod?.cube) {
        try {
          const cube = await ApiClient.getCubeById(playerPod.cube.id);
          setPlayerCube(cube);
        } catch (error) {
          if (error instanceof ApiException) {
            console.error("Failed to fetch cube:", error.message);
          }
        }
      }
    };

    fetchCube();
  }, [playerPod, playerCube]);

  // Process picked cards and update deck building status
  useEffect(() => {
    if (playerPod && playerSeat) {
      // mark deck building done when user has submitted a deck photo
      setDeckBuildingDone(!!playerSeat.deckPhotoUrl);

      // get other seats for progress bar
      const seats: DraftPodSeat[] = [];
      for (const pod of draft.pods) {
        seats.push(...pod.seats);
      }

      if (totalPlayers === 0) {
        setTotalPlayers(seats.length);
      }

      // Calculate deck building status for all seats
      const deckBuilding = seats.map((seat) => ({
        seat: seat.seat,
        pickedCards:
          (playerPod.cube?.cardlist?.cards ?? [])
            .flatMap((card) => card.pickedCards)
            .filter((pc) => pc.picker.seat === seat.seat) ?? [],
      }));

      setDeckBuildingStatus(deckBuilding);
    }
  }, [playerPod, playerSeat, draft.pods, totalPlayers]);

  if (user && draft && playerPod && playerSeat && playerCube) {
    return (
      <>
        <HelmetTitle
          titleText={tournament.name + " Draft " + draft.draftNumber}
        />
        <Row>
          <h2 className="display-2">Draft: {draft.draftNumber}</h2>
        </Row>
        <Row>
          <Container>
            <HorizontalIconCard
              iconName="Box"
              cardTitle={playerPod.cube?.title ?? ""}
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
        <DeckBuildingSubmission
          seat={playerSeat}
          cube={playerCube}
          photoUrl={playerPoolPhotoUrl}
          tournamentId={tournament.id}
          done={deckBuildingDone}
          setDraft={setDraft}
          POOLSIZE={POOLSIZE}
        />
      </>
    );
  }
}

export default DraftOngoing;
