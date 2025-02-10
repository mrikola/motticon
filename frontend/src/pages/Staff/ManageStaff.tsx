import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Tournament } from "../../types/Tournament";
import { useEffect, useMemo, useState } from "react";
import { get, post } from "../../services/ApiService";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import DatalistInput, { Item } from "react-datalist-input";
import { User } from "../../types/User";
import { useIsAdmin } from "../../utils/auth";
import { PersonFillAdd, XLg } from "react-bootstrap-icons";

const ManageStaff = () => {
  const user = useIsAdmin();
  const { tournamentId } = useParams();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [item, setItem] = useState<Item>(); // The selected item will be stored in this state.
  const [value, setValue] = useState<string>();
  const [selectedUser, setSelectedUser] = useState("No user selected");
  const [staff, setStaff] = useState<User[]>([]);

  // set data list options based on staff
  useEffect(() => {
    if (allUsers.length > 0) {
      const users: User[] = [];
      for (let i = 0; i < staff.length; i++) {
        users.push(staff[i]);
      }
      const usersIdOnly = users.map((x) => x.id);
      const notStaff = allUsers.filter(
        (item) => !usersIdOnly.includes(item.id)
      );
      notStaff.sort((a, b) => a.lastName.localeCompare(b.lastName));
      setAvailableUsers(notStaff);
    }
  }, [allUsers, staff]);

  // Make sure each option has an unique id and a value
  const items = useMemo(
    () =>
      availableUsers.map((user) => ({
        // required: id and value
        value: user.firstName + " " + user.lastName + " (" + user.email + ")",
        // optional: label, node
        // label: option.name, // use a custom label instead of the value
        // node: option.name, // use a custom ReactNode to display the option
        ...user, // pass along any other properties to access in your onSelect callback
      })),
    [availableUsers]
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/user/all`);
      const users = (await response.json()) as User[];
      setAllUsers(users);
    };
    fetchData();
  }, []);

  function addToStaff() {
    if (item) {
      const userId = item.id;
      console.log("adding to staff: " + item.value + ", id: " + userId);
      post(`/tournament/${tournamentId}/staff/${userId}/add`, {}).then(
        async (resp) => {
          const tourny = (await resp.json()) as Tournament;
          if (tourny) {
            console.log(tourny);
            toast.success("Added " + item.value + " to staff");
            setItem(undefined);
            setSelectedUser("No user selected");
            const stf = tourny.staffMembers.sort((a, b) =>
              a.firstName.localeCompare(b.firstName)
            );
            setStaff(stf);
          } else {
            console.log("add to staff failed");
          }
        }
      );
    } else {
      console.log("no user selected");
    }
  }

  function removeStaff(staffer: User) {
    const userId = staffer.id;
    console.log(
      "removing from staff: " +
        staffer.firstName +
        " " +
        staffer.lastName +
        ", id: " +
        userId
    );
    post(`/tournament/${tournamentId}/staff/${userId}/remove`, {}).then(
      async (resp) => {
        const tourny = (await resp.json()) as Tournament;
        if (tourny) {
          console.log(tourny);
          toast.success(
            "Removed " +
              staffer.firstName +
              " " +
              staffer.lastName +
              " from staff"
          );
          const stf = tourny.staffMembers.sort((a, b) =>
            a.firstName.localeCompare(b.firstName)
          );
          setStaff(stf);
        } else {
          console.log("remove from staff failed");
        }
      }
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/tournament/${tournamentId}/staff`);
      const tournament = (await response.json()) as Tournament;
      const stf = tournament.staffMembers;
      setStaff(stf);
      console.log(tournament);
    };
    fetchData();
  }, []);

  function handleSelection(item: Item) {
    setItem(item);
    console.log(item);
    setSelectedUser("Add to staff: " + item.value);
    setValue(undefined); // Custom behavior: Clear input field once a value has been selected
  }

  if (user) {
    return (
      <Container className="mt-3 my-md-4">
        <HelmetTitle titleText="Manage Staff" />
        <Row>
          <BackButton
            buttonText="Back to tournament"
            path={`/tournament/${tournamentId}`}
          />
          <Col xs={12}>
            <h1 className="display-1">Manage staff</h1>
          </Col>
        </Row>
        <Col xs={12}>
          <h2>Add Staff</h2>
          <DatalistInput
            label="Add user to staff"
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
          <Button variant="info" className="text-light" onClick={addToStaff}>
            <div className="icon-link">
              <PersonFillAdd className="fs-4" /> {selectedUser}
            </div>
          </Button>
        </Col>
        <Row>
          <Col xs={12}>
            <h2>Current staff</h2>
            <Table striped borderless hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Remove from staff</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => removeStaff(user)}
                      >
                        <XLg /> Remove from staff
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default ManageStaff;
