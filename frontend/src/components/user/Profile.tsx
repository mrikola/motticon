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
      <Container className="mt-3 my-md-4">
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
          <Col>
            <Button 
              variant="primary"
              onClick={() =>
                get("/user/profile").then(async (resp) =>
                  console.log(await resp.text())
                )
              }
            >
              do normal user shit
            </Button>
          </Col>
          <Col>
            <Button 
              variant="primary"
              onClick={() => get("/admin")}
            >
              do admin shit
            </Button>
          </Col>
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
