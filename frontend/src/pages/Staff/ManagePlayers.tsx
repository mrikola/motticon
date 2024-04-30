import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Tournament } from "../../types/Tournament";
import { useEffect, useMemo, useState } from "react";
import { get, post } from "../../services/ApiService";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import DatalistInput, { Item } from "react-datalist-input";
import { Enrollment } from "../../types/User";
import { useIsAdmin } from "../../utils/auth";
import { PersonFillX } from "react-bootstrap-icons";
import VerticallyCenteredModal, {
  VerticallyCenteredModalProps,
} from "../../components/general/VerticallyCenteredModal";

const ManagePlayers = () => {
  const user = useIsAdmin();
  const { tournamentId } = useParams();

  const [item, setItem] = useState<Item>(); // The selected item will be stored in this state.
  const [value, setValue] = useState<string>();
  const [selectedUser, setSelectedUser] = useState("No player selected");
  const [activePlayers, setActivePlayers] = useState<Enrollment[]>([]);
  const [droppedPlayers, setDroppedPlayers] = useState<Enrollment[]>([]);
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([]);
  const [modal, setModal] = useState<VerticallyCenteredModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
    variant: "info",
  });

  // set data list options based on enrolled players
  useEffect(() => {
    if (allEnrollments.length > 0) {
      setDroppedPlayers(allEnrollments.filter((item) => item.dropped));
      setActivePlayers(allEnrollments.filter((item) => !item.dropped));
    }
    // if (enrolledUsers.length > 0) {
    //   const players: Player[] = [];
    //   for (let i = 0; i < enrollments.length; i++) {
    //     players.push(enrollments[i].player);
    //   }
    //   const playersIdOnly = players.map((x) => x.id);
    //   const notEnrolled = allPlayers.filter(
    //     (item) => !playersIdOnly.includes(item.id)
    //   );
    //   notEnrolled.sort((a, b) => a.lastName.localeCompare(b.lastName));
    //   setAvailablePlayers(notEnrolled);
    // }
  }, [allEnrollments]);

  // Make sure each option has an unique id and a value
  const items = useMemo(
    () =>
      activePlayers.map((enrollment) => ({
        // required: id and value
        id: enrollment.player.id,
        value:
          enrollment.player.firstName +
          " " +
          enrollment.player.lastName +
          " (" +
          enrollment.player.email +
          ")",
        ...enrollment, // pass along any other properties to access in your onSelect callback
      })),
    [activePlayers]
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/enrollment`);
      const tourny = (await response.json()) as Tournament;
      setAllEnrollments(tourny.enrollments);
    };
    fetchData();
  }, []);

  function dropPlayer() {
    if (item) {
      const userId = item.player.id;
      console.log("dropping: " + item.value + ", id: " + userId);
      post(`/tournament/${tournamentId}/drop/${userId}`, {}).then(
        async (resp) => {
          const tourny = (await resp.json()) as Tournament;
          if (tourny) {
            setModal({
              ...modal,
              show: false,
            });
            toast.success("Dropped " + item.value + " from tournament");
            setItem(undefined);
            setSelectedUser("No user selected");
            setAllEnrollments(tourny.enrollments);
          } else {
            console.log("add to staff failed");
          }
        }
      );
    } else {
      console.log("no user selected");
    }
  }

  function handleDropClick() {
    if (item) {
      setModal({
        show: true,
        onHide: () => null,
        heading: "Confirm drop",
        text:
          "Are you sure you want to drop " +
          item.value +
          " from this tournament?",
        actionText: "Confirm drop",
        actionFunction: dropPlayer,
        variant: "info",
      });
    }
  }

  function handleSelection(item: Item) {
    setItem(item);
    console.log(item);
    setSelectedUser("Drop from tournament: " + item.value);
    setValue(undefined); // Custom behavior: Clear input field once a value has been selected
  }

  if (user) {
    return (
      <Container className="mt-3 my-md-4">
        <HelmetTitle titleText="Manage Players" />
        <Row>
          <BackButton
            buttonText="Back to tournament"
            path={`/tournament/${tournamentId}`}
          />
          <Col xs={12}>
            <h1 className="display-1">Manage players</h1>
          </Col>
        </Row>
        <Col xs={12}>
          <h2>Drop player</h2>
          <DatalistInput
            label="Drop player"
            placeholder="Type to search..."
            items={items}
            selectedItem={item}
            value={value}
            setValue={(value) => setValue(value)}
            onSelect={(item) => {
              handleSelection(item);
            }}
          />
        </Col>
        <Col xs={12} className="my-3 d-grid">
          <Button variant="danger" onClick={handleDropClick} disabled={!item}>
            <div className="icon-link">
              <PersonFillX className="fs-4" /> {selectedUser}
            </div>
          </Button>
        </Col>
        <Row>
          <Col xs={12}>
            <h2>Dropped players</h2>
            <Table striped borderless hover>
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {droppedPlayers
                  .sort((a, b) =>
                    a.player.lastName.localeCompare(b.player.lastName)
                  )
                  .map((enrollment) => (
                    <tr key={enrollment.player.id}>
                      <td>
                        {enrollment.player.firstName}{" "}
                        {enrollment.player.lastName}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
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
      </Container>
    );
  }
};

export default ManagePlayers;
