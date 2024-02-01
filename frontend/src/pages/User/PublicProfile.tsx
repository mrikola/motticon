import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../../components/general/Loading";
import { useContext, useEffect, useState } from "react";
import { get } from "../../services/ApiService";
import HelmetTitle from "../../components/general/HelmetTitle";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { User } from "../../types/User";

const PublicProfile = () => {
  const user = useContext(UserInfoContext);
  const { userId } = useParams();
  const [player, setPlayer] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/user/${userId}`);
      const playerObject = (await response.json()) as User;
      console.log(playerObject);
      setPlayer(playerObject);
    };
    fetchData();
  }, [user, userId]);

  return user && player ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle
        titleText={"Profile: " + player.firstName + " " + player.lastName}
      />
      <Row className="my-3">
        <Col xs={12}>
          <h1 className="display-1">
            {player.firstName + " " + player.lastName}
          </h1>
        </Col>
      </Row>
      <Row className="my-3">
        <Col xs={12}>
          <h2>Rating</h2>
          <p className="lead">Current rating: {player.rating}</p>
        </Col>
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default PublicProfile;
