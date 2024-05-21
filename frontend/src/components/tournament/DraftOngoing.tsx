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
import { Cube } from "../../types/Cube";

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

  // get relevant draft info
  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/draft/${draft.id}/user/${user?.id}`);
      const draftPod = (await response.json()) as DraftPod;
      setPlayerPod(draftPod);
      setPlayerSeat(draftPod.seats[0]);
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

  // get pod info from draft-object rather than having to do extra backend call
  // useEffect(() => {
  //   if (user) {
  //     // console.log(draft);
  //     Object.values(draft.pods).forEach((pod) => {
  //       // console.log(pod);
  //       Object.values(pod.seats).forEach((seat) => {
  //         if (seat.player.id === user.id) {
  //           // console.log("found user pod");
  //           // console.log(pod);
  //           // console.log(seat);
  //           // setPlayerPod(pod);
  //           // setPlayerSeat(seat);
  //           // seat.deckPhotoUrl
  //           //   ? setDeckBuildingDone(true)
  //           //   : setDeckBuildingDone(false);
  //         }
  //       });
  //     });
  //   }
  // }, [draft, draft.pods, user]);

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
      setBuildingRemaining(
        allSeats.filter((seat) => !seat.deckPhotoUrl).length
      );
    }
  }, [allSeats]);

  // callback function for modal once player confirms submit
  function doneSetter(value: boolean) {
    setDeckBuildingDone(value);
    console.log("done set to: " + value);
  }

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
          setDone={doneSetter}
          setDraft={setDraft}
        />
      </>
    );
  }
}

export default DraftOngoing;
