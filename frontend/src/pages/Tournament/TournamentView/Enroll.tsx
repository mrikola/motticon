import { ReactNode, useEffect, useState } from "react";
import { post } from "../../../services/ApiService";
import { Col, Row, Button } from "react-bootstrap";
import {
  CheckSquare,
  CheckSquareFill,
  XLg,
  ExclamationTriangleFill,
  PersonPlusFill,
} from "react-bootstrap-icons";
import VerticallyCenteredModal, {
  VerticallyCenteredModalProps,
} from "../../../components/general/VerticallyCenteredModal";
import { Tournament } from "../../../types/Tournament";
import { toast } from "react-toastify";

type Props = {
  isEnrolled: boolean;
  userId: number;
  enrolledChanger: (isEnrolled: boolean) => void;
  freeSeats: number;
  freeSeatsUpdater: (val: number) => void;
  tournament: Tournament;
  userEnrollmentEnabled: boolean;
};

function Enroll({
  isEnrolled,
  userId,
  enrolledChanger,
  freeSeats,
  freeSeatsUpdater,
  tournament,
  userEnrollmentEnabled,
}: Props) {
  const [modal, setModal] = useState<VerticallyCenteredModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
    variant: "primary",
  });
  const [enrollButtonText, setEnrollButtonText] = useState<string>();
  // consider creating an Icon component and passing it the icon name as a prop
  const [enrollButtonIcon, setEnrollButtonIcon] = useState<ReactNode>();
  /*
  const enrollSuccess = () =>
    toast.success("Enrolled successfully", {
      position: "bottom-center",
      autoClose: 2000,
      theme: "colored",
      pauseOnHover: false,
    });

  const cancelSuccess = () =>
    toast.success("Cancelled enrollment succesfully", {
      position: "bottom-center",
      autoClose: 2000,
      theme: "colored",
      pauseOnHover: false,
    });
  */
  useEffect(() => {
    if (isEnrolled) {
      setEnrollButtonText("Enrolled");
      setEnrollButtonIcon(<CheckSquareFill className="fs-3" />);
    } else if (!isEnrolled && freeSeats > 0) {
      setEnrollButtonText("Enroll");
      setEnrollButtonIcon(<CheckSquare className="fs-3" />);
    } else if (freeSeats === 0) {
      setEnrollButtonText("Tournament full");
      setEnrollButtonIcon(<ExclamationTriangleFill className="fs-3" />);
    }
  }, [isEnrolled]);

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
          toast.success("Enrolled succesfully");
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
          toast.success("Cancelled enrollment succesfully");
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
      variant: "primary",
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
      variant: "primary",
    });
  }

  if (tournament) {
    return (
      <Row className="my-3">
        <Col xs={12}>
          <h2 className="icon-link">
            <PersonPlusFill /> Enrollment
          </h2>
          <p>Price: {tournament.entryFee}</p>
          <p>
            Seats left: {freeSeats}/{tournament.totalSeats}
          </p>
        </Col>
        <Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
          {userEnrollmentEnabled ? (
            <>
              <Button
                variant="primary"
                className="btn-lg"
                type="submit"
                onClick={() => handleEnrollClick()}
                disabled={isEnrolled || freeSeats === 0 ? true : false}
              >
                <div className="icon-link">
                  {enrollButtonIcon} {enrollButtonText}
                </div>
              </Button>

              {isEnrolled && (
                <Button
                  variant="danger"
                  className="btn-lg"
                  type="submit"
                  onClick={handleCancelClick}
                >
                  <div className="icon-link">
                    <XLg className="fs-3" /> Cancel enrollment
                  </div>
                </Button>
              )}
            </>
          ) : (
            <p className="lead">
              Only tournament staff may enroll players to this tournament.
            </p>
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
          variant="primary"
        />
      </Row>
    );
  }
}

export default Enroll;
