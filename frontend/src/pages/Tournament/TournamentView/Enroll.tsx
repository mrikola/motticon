import { useState } from "react";
import { post } from "../../../services/ApiService";
import { Col, Row, Button } from "react-bootstrap";
import { CheckSquare, CheckSquareFill, XLg } from "react-bootstrap-icons";
import VerticallyCenteredModal, {
  ModalProps,
} from "../../../components/general/VerticallyCenteredModal";

type Props = {
  isEnrolled: boolean;
  tournamentId: number;
  userId: number;
  enrolledChanger: (isEnrolled: boolean) => void;
};

function Enroll({ isEnrolled, tournamentId, userId, enrolledChanger }: Props) {
  const [modal, setModal] = useState<ModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
  });

  const doEnroll = () => {
    post(`/tournament/${tournamentId}/enroll/${userId}`, {}).then(
      async (resp) => {
        // temporary solution that just checks boolean return (should be object with tournament info)
        const enrolled = await resp.text();
        if (enrolled) {
          setModal({
            ...modal,
            show: false,
          });
          enrolledChanger(true);
        }
      }
    );
  };

  const doCancel = () => {
    post(`/tournament/${tournamentId}/cancel/${userId}`, {}).then(
      async (resp) => {
        // temporary solution that just checks boolean return (should be object with tournament info)
        const cancelled = Boolean(await resp.text());
        if (cancelled) {
          setModal({
            ...modal,
            show: false,
          });
          enrolledChanger(false);
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

  // todo: add generating of multiple standings based on data
  return (
    <Row>
      <Col xs={12}>
        <h2>Enroll</h2>
        <p>Price: free</p>
        <p>Seats left: 8/8</p>
        <Button
          variant="primary"
          type="submit"
          onClick={() => handleEnrollClick()}
          disabled={isEnrolled}
        >
          {!isEnrolled ? (
            <>
              <CheckSquare /> Enroll
            </>
          ) : (
            <>
              <CheckSquareFill /> Enrolled
            </>
          )}
        </Button>
        {isEnrolled && (
          <Row>
            <Col xs={12}>
              <Button
                variant="danger"
                type="submit"
                onClick={handleCancelClick}
              >
                <XLg /> Cancel enrollment
              </Button>
            </Col>
          </Row>
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

export default Enroll;
