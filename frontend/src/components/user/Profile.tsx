import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../provider/UserInfoProvider";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Box, BoxArrowRight } from "react-bootstrap-icons";

const Profile = () => {
  const user = useContext(UserInfoContext);
  const navigate = useNavigate();
  if (user) {
    return (
      <>
      <Container>
        <Row>
          <h1>Hello, {user.firstName} {user.lastName}</h1>
        </Row>
        <Row>
          <h2>Cube preferences</h2>
          <Link to={`/user/cubePreferences`}>
            <Button variant="primary">
              <Box /> Set your cube preferences
            </Button>
          </Link>
        </Row>
        <Row>
          <h2>click these and watch the console</h2>
        </Row>
        <Row>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              get("/user/profile").then(async (resp) =>
                console.log(await resp.text())
              )
            }
          >
            do normal user shit
          </button>
        </Row>
        <Row>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => get("/admin")}
          >
            do admin shit
          </button>
        </Row>
        <Row>
          <Link to={"/logout"}>
            <Button variant="danger">
              <BoxArrowRight /> Log out
            </Button>
          </Link>
        </Row>
        </Container>
      </>
    );
  } else {
    return <>no user lul</>;
  }
};

export default Profile;
