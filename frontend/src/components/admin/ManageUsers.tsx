import { Col, Container, Row, Button } from "react-bootstrap";
import { get, post } from "../../services/ApiService";
import { useIsAdmin } from "../../utils/auth";
import Loading from "../general/Loading";
import { useEffect, useMemo, useState } from "react";
import DatalistInput, { Item } from "react-datalist-input";
import HelmetTitle from "../general/HelmetTitle";
import BackButton from "../general/BackButton";
import { toast } from "react-toastify";
import { User } from "../../types/User";
import { XOctagonFill } from "react-bootstrap-icons";
import VerticallyCenteredModal, {
  VerticallyCenteredModalProps,
} from "../general/VerticallyCenteredModal";

function ManageUsers() {
  const user = useIsAdmin();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [item, setItem] = useState<Item>(); // The selected item will be stored in this state.
  const [value, setValue] = useState<string>();
  const [selectedUser, setSelectedUser] = useState("No user selected");
  const [modal, setModal] = useState<VerticallyCenteredModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
  });

  // Make sure each option has an unique id and a value
  const items = useMemo(
    () =>
      allUsers.map((user) => ({
        // required: id and value
        value: user.firstName + " " + user.lastName + " (" + user.email + ")",
        // optional: label, node
        // label: option.name, // use a custom label instead of the value
        // node: option.name, // use a custom ReactNode to display the option
        ...user, // pass along any other properties to access in your onSelect callback
      })),
    [allUsers]
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/user`);
      const users = (await response.json()) as User[];
      setAllUsers(users);
      console.log(users);
    };
    fetchData();
  }, []);

  function handleSelection(item: Item) {
    setItem(item);
    console.log(item);
    setSelectedUser("Delete: " + item.value);
    setValue(undefined); // Custom behavior: Clear input field once a value has been selected
  }

  function deleteUser() {
    if (item) {
      const userId = item.id;
      console.log("deleting user " + item.value + ", id: " + userId);
      post(`/deleteUser/${userId}`, {}).then(async (resp) => {
        const success = (await resp.json()) as boolean;
        if (success) {
          toast.success("Deleted " + item.value);
          setItem(undefined);
          setSelectedUser("No player selected");
        } else {
          console.log("delete failed");
        }
      });
    } else {
      console.log("no player selected");
    }
  }

  function handleDeleteClick() {
    setModal({
      show: true,
      onHide: () => null,
      heading: "Confirm user delete",
      text: "Are you sure you want to delete user: " + item.value + "?  ",
      actionText: "Confirm delete",
      actionFunction: deleteUser,
    });
  }

  return user ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText="Manage Users" />
      <Row>
        <BackButton buttonText="Back to admin" path="/admin" />
        <Col xs={12}>
          <h1 className="display-1">Manage Users</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h2>Delete User</h2>
          <p className="lead">Be careful! Deletion is final.</p>
          <DatalistInput
            label="Delete user"
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
          <Button variant="primary" onClick={handleDeleteClick}>
            <div className="icon-link">
              <XOctagonFill className="fs-4" /> {selectedUser}
            </div>
          </Button>
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
    </Container>
  ) : (
    <Loading />
  );
}

export default ManageUsers;
