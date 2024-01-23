import { ReactNode, useEffect, useState } from "react";
import { post } from "../../../services/ApiService";
import { Col, Row, Button } from "react-bootstrap";
import {
  CheckSquare,
  CheckSquareFill,
  XLg,
  ExclamationTriangleFill,
} from "react-bootstrap-icons";
import VerticallyCenteredModal, {
  ModalProps,
} from "../../../components/general/VerticallyCenteredModal";
import { Tournament } from "../../../types/Tournament";

type Props = {
  isEnrolled: boolean;
  userId: number;
  enrolledChanger: (isEnrolled: boolean) => void;
  freeSeats: number;
  freeSeatsUpdater: (val: number) => void;
  tournament: Tournament;
};

function Enroll({
  isEnrolled,
  userId,
  enrolledChanger,
  freeSeats,
  freeSeatsUpdater,
  tournament,
}: Props) {
  const [modal, setModal] = useState<ModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
  });
  const [enrollButtonText, setEnrollButtonText] = useState<string>();
  // consider creating an Icon component and passing it the icon name as a prop
  const [enrollButtonIcon, setEnrollButtonIcon] = useState<ReactNode>();

  useEffect(() => {
    if (isEnrolled) {
      setEnrollButtonText("Enrolled");
      setEnrollButtonIcon(<CheckSquareFill />);
    } else if (!isEnrolled && freeSeats > 0) {
      setEnrollButtonText("Enroll");
      setEnrollButtonIcon(<CheckSquare />);
    } else if (freeSeats === 0) {
      setEnrollButtonText("Tournament full");
      setEnrollButtonIcon(<ExclamationTriangleFill />);
    }
  }, []);

  const doEnroll = () => {
    post(`/tournament/${tournament.id}/enroll/${userId}`, {}).then(
      async (resp) => {
        // temporary solution that just checks boolean return (should be object with tournament info)
        const enrolled = await resp.text();
        if (enrolled) {
          setModal({
            ...modal,
            show: false,
          });
          enrolledChanger(true);
          freeSeatsUpdater(-1);
        }
      }
    );
  };

  const doCancel = () => {
    post(`/tournament/${tournament.id}/cancel/${userId}`, {}).then(
      async (resp) => {
        // temporary solution that just checks boolean return (should be object with tournament info)
        const cancelled = Boolean(await resp.text());
        if (cancelled) {
          setModal({
            ...modal,
            show: false,
          });
          enrolledChanger(false);
          freeSeatsUpdater(1);
        }
      }
    );
  };

  function handleEnrollClick() {
    setModal({
      show: true,
      onHide: () => null,
      heading: "Confirm enrollment",
      text: "Are you sure you want to enroll to this tournament?",
      actionText: "Confirm enrollment",
      actionFunction: doEnroll,
    });
  }

  function handleCancelClick() {
    setModal({
      show: true,
      onHide: () => null,
      heading: "Confirm enrollment cancellation",
      text: "Are you sure you want to cancel your enrollment to this tournament?",
      actionText: "Confirm cancellation",
      actionFunction: doCancel,
    });
  }

  if (tournament) {
    return (
      <Row className="my-3">
        <Col xs={12}>
          <h2>Enroll</h2>
          <p>Price: {tournament.entryFee}</p>
          <p>
            Seats left: {freeSeats}/{tournament.totalSeats}
          </p>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
          <Button
            variant="primary"
            className="btn-lg"
            type="submit"
            onClick={() => handleEnrollClick()}
            disabled={isEnrolled || freeSeats === 0 ? true : false}
          >
            {enrollButtonIcon} {enrollButtonText}
          </Button>
          {isEnrolled && (
            <Button
              variant="danger"
              className="btn-lg"
              type="submit"
              onClick={handleCancelClick}
            >
              <XLg /> Cancel enrollment
            </Button>
          )}
        </Col>
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
          actionText={modal.actionText}
          actionFunction={modal.actionFunction}
        />
      </Row>
    );
  }
}

export default Enroll;
