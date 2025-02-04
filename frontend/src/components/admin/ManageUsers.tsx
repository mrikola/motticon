import { Col, Container, Row, Button, FloatingLabel } from "react-bootstrap";
import { get, post, put } from "../../services/ApiService";
import { useIsAdmin } from "../../utils/auth";
import Loading from "../general/Loading";
import { useEffect, useMemo, useState } from "react";
import DatalistInput, { Item } from "react-datalist-input";
import HelmetTitle from "../general/HelmetTitle";
import BackButton from "../general/BackButton";
import { toast } from "react-toastify";
import { User } from "../../types/User";
import { Form } from "react-bootstrap";
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
  const [password1, setPassword1] = useState<string>();
  const [password2, setPassword2] = useState<string>();

  const [modal, setModal] = useState<VerticallyCenteredModalProps>({
    show: false,
    onHide: () => null,
    heading: "",
    text: "",
    actionText: "",
    actionFunction: () => {},
    variant: "info",
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
      const response = await get(`/user/all`);
      const users = (await response.json()) as User[];
      setAllUsers(users);
      console.log(users);
    };
    fetchData();
  }, []);

  function handleSelection(item: Item) {
    setItem(item);
    setSelectedUser(item.value);
    setValue(undefined); // Custom behavior: Clear input field once a value has been selected
  }

  function setPasswordForUser() {
    if (item) {
      const userId = item.id;
      put(`/user/password/${userId}`, { password: password1 }).then(
        async (resp) => {
          const success = (await resp.json()) as boolean;
          if (success) {
            toast.success("Set password for user " + item.value);
            setItem(undefined);
            setSelectedUser("No player selected");
          } else {
            console.log("password change failed");
          }
        }
      );
    } else {
      console.log("no player selected");
    }
  }

  function handleSetPasswordClick() {
    setModal({
      show: true,
      onHide: () => null,
      heading: "Confirm password change",
      text: "Are you sure you want to set password for: " + item.value + "?",
      actionText: "Confirm password change",
      actionFunction: setPasswordForUser,
      variant: "info",
    });
  }

  function deleteUser() {
    if (item) {
      const userId = item.id;
      console.log("deleting user " + item.value + ", id: " + userId);
      post(`/user/delete/${userId}`, {}).then(async (resp) => {
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
      text: "Are you sure you want to delete user: " + item.value + "?",
      actionText: "Confirm delete",
      actionFunction: deleteUser,
      variant: "info",
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
          <DatalistInput
            label="Search user"
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
        <Col xs={6} className="my-6 d-grid">
          <FloatingLabel label="Password">
            <Form.Control
              type="password"
              value={password1}
              placeholder="Password"
              onChange={(event) => setPassword1(event.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel label="Repeat password">
            <Form.Control
              type="password"
              value={password2}
              placeholder="Repeat password"
              onChange={(event) => setPassword2(event.target.value)}
            />
          </FloatingLabel>
          <Button
            variant="primary"
            disabled={password1 !== password2}
            onClick={handleSetPasswordClick}
          >
            Set password for {selectedUser}
          </Button>
        </Col>
        <Col xs={3}></Col>
        <Col xs={3} className="my-3 d-grid">
          <Button variant="danger" onClick={handleDeleteClick}>
            <div className="icon-link">
              <XOctagonFill className="fs-4" />{" "}
              {item ? "Delete: " + selectedUser : "No user selected"}
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
          variant="info"
        />
      </Row>
    </Container>
  ) : (
    <Loading />
  );
}

export default ManageUsers;
