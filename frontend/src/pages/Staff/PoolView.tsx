import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { get, post } from "../../services/ApiService";
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
import PoolsReturnedTable from "../../components/staff/PoolsReturnedTable";
import PoolReturnedModal, {
  PoolReturnedModalProps,
} from "../../components/staff/PoolReturnedModal";
import { toast } from "react-toastify";

function PoolView() {
  const { tournamentId } = useParams();
  const user = useIsTournamentStaff(Number(tournamentId));
  const [currentDraft, setCurrentDraft] = useState<Draft>();
  const [tournament, setTournament] = useState<Tournament>();
  const [modal, setModal] = useState<PoolReturnedModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
    seat: {} as DraftPodSeat,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [draftResponse] = await Promise.all([
        get(`/tournament/${tournamentId}/draft`),
      ]);
      try {
        const draft = (await draftResponse.json()) as Draft;
        setCurrentDraft(draft);
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

  function markReturned(seat: DraftPodSeat) {
    if (seat) {
      const seatId = seat.id;
      post(`/tournament/${tournamentId}/setDraftPoolReturned`, {
        tournamentId,
        seatId,
      }).then(async (resp) => {
        const draft = (await resp.json()) as Draft;
        if (draft !== null) {
          // console.log(draft);
          toast.success(
            seat.player.firstName +
              " " +
              seat.player.lastName +
              " draft pool returned"
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
      heading: "Confirm draft pool returned",
      text:
        "Are you sure you want to confirm draft pool returned for: " +
        clickedSeat.player.firstName +
        " " +
        clickedSeat.player.lastName +
        " (Seat " +
        clickedSeat.seat +
        ")",
      actionText: "Confirm returned",
      actionFunction: markReturned,
      seat: clickedSeat,
    });
  }

  return user && tournament ? (
    <Container className="mt-3 my-md-4">
      <Row>
        <BackButton
          buttonText="Back to tournament"
          path={`/tournament/${tournamentId}/staff`}
        />
        <h1 className="display-1">{tournament.name} draft pools</h1>
        <p className="lead">
          Click the draft pod number to show all players for that pod.
        </p>
      </Row>
      {currentDraft && (
        <Accordion defaultActiveKey="0" flush className="staff-accordion">
          {currentDraft.pods
            .sort((a, b) => a.podNumber - b.podNumber)
            .map((pod: DraftPod) => {
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
      <PoolReturnedModal
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
    </Container>
  ) : (
    <Loading />
  );
}
export default PoolView;
