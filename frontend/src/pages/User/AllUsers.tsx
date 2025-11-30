import { Col, Row, Table } from "react-bootstrap";
import Loading from "../../components/general/Loading";
import { useContext, useEffect, useState } from "react";
import { get } from "../../services/ApiService";
import HelmetTitle from "../../components/general/HelmetTitle";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Player } from "../../types/User";
import { Link } from "react-router-dom";
import PageContainer from "../../components/general/PageContainer";

const AllUsers = () => {
  const user = useContext(UserInfoContext);
  const [allPlayers, setAllPlayers] = useState<Player[]>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`/user/all`);
      const players = (await response.json()) as Player[];
      const sortedPlayers = [...players].sort((a, b) => (a.rating! > b.rating! ? -1 : 1));
      setAllPlayers(sortedPlayers);
    };
    fetchData();
  }, []);

  return user && allPlayers ? (
    <PageContainer>
      <HelmetTitle titleText={"Players"} />
      <Row className="my-3">
        <Col>
          <h1 className="display-1">Rating Leaderboard</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped borderless responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {allPlayers.map((player, index) => (
                <tr key={player.id}>
                  <td>{index + 1}</td>
                  <td className="td-no-wrap">
                    <Link to={`/user/${player.id}`}>
                      {player.firstName} {player.lastName}
                    </Link>
                  </td>
                  <td>{player.rating}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </PageContainer>
  ) : (
    <Loading />
  );
};

export default AllUsers;
