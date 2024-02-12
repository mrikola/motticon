import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { get } from "../../services/ApiService";
import { Accordion, Container, Row } from "react-bootstrap";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import {
  Draft,
  DraftPod,
  DraftPodSeat,
  Tournament,
} from "../../types/Tournament";
import { useIsTournamentStaff } from "../../utils/auth";
import Loading from "../../components/general/Loading";
import BackButton from "../../components/general/BackButton";
import FullscreenImageModal, {
  FullscreenImageModalProps,
} from "../../components/general/FullscreenImageModal";
import PoolsReturnedTable from "../../components/staff/PoolsReturnedTable";

function PoolView() {
  const { tournamentId } = useParams();
  const user = useIsTournamentStaff(Number(tournamentId));
  const [currentDraft, setCurrentDraft] = useState<Draft>();
  const [tournament, setTournament] = useState<Tournament>();
  const [modal, setModal] = useState<FullscreenImageModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [draftResponse] = await Promise.all([
        get(`/tournament/${tournamentId}/draft`),
      ]);
      try {
        const draft = (await draftResponse.json()) as Draft;
        setCurrentDraft(draft);
        console.log(draft);
      } catch {
        // TODO handle invalid response
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (!tournament) {
      const fetchData = async () => {
        const response = await get(`/tournament/${tournamentId}`);
        const tourny = (await response.json()) as Tournament;
        setTournament(tourny);
      };
      if (user) {
        fetchData();
      }
    }
  }, [user]);

  function setModalContent(seat: DraftPodSeat) {
    setModal({
      show: true,
      onHide: () => null,
      heading:
        "Draft " +
        currentDraft?.draftNumber +
        ", Seat " +
        seat.seat +
        ", " +
        seat.player.firstName +
        " " +
        seat.player.lastName,
      imageUrl: seat.deckPhotoUrl,
    });
  }

  function markDoneClicked(clickedSeat: DraftPodSeat) {
    console.log("marked returend");
    // setModal({
    //   show: true,
    //   onHide: () => null,
    //   heading: "Confirm deck building complete",
    //   text:
    //     "Are you sure you want to confirm deck building complete for: " +
    //     clickedSeat.player.firstName +
    //     " " +
    //     clickedSeat.player.lastName,
    //   actionText: "Confirm complete",
    //   actionFunction: markDone,
    //   seat: clickedSeat,
    // });
  }

  return user && tournament ? (
    <Container className="mt-3 my-md-4">
      <Row>
        <BackButton
          buttonText="Back to tournament"
          path={`/tournament/${tournamentId}`}
        />
        <h1 className="display-1">{tournament.name} draft pools</h1>
        <p className="lead">
          Click the player name to see their draft pool. Click on the image of
          the draft pool to open a larger version of it.
        </p>
      </Row>
      {currentDraft && (
        <Accordion defaultActiveKey="0" flush>
          {currentDraft.pods.map((pod: DraftPod) => {
            pod.seats.sort((a, b) => a.seat - b.seat);
            return (
              <PoolsReturnedTable
                key={pod.id}
                draft={currentDraft}
                pod={pod}
                seats={pod.seats}
                markDoneClicked={markDoneClicked}
              />
            );
          })}
        </Accordion>
      )}
      <FullscreenImageModal
        show={modal.show}
        onHide={() =>
          setModal({
            ...modal,
            show: false,
          })
        }
        heading={modal.heading}
        imageUrl={modal.imageUrl}
      />
    </Container>
  ) : (
    <Loading />
  );
}
export default PoolView;
