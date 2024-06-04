import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Color, Cube } from "../../types/Cube";
import { get } from "../../services/ApiService";
import { PenFill, BoxArrowUpRight } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import Loading from "../../components/general/Loading";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";

const ViewCubeGeneral = () => {
  const user = useContext(UserInfoContext);
  const isAdmin = user?.isAdmin;
  const { cubeId } = useParams();
  const [cube, setCube] = useState<Cube>();
  const colors: Color[] = ["W", "U", "B", "R", "G"];

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/cube/${cubeId}`);
      const cube = (await resp.json()) as Cube;
      console.log(cube);
      setCube(cube);
    };

    fetchData();
  }, [cubeId]);

  const colorSymbolToHeading = (symbol: Color) => {
    switch (symbol) {
      case "W":
        return "White";
      case "U":
        return "Blue";
      case "B":
        return "Black";
      case "R":
        return "Red";
      case "G":
        return "Green";
    }
  };

  if (cube) {
    return (
      <>
        <HelmetTitle titleText={cube.title} />
        <div
          className="cube-masthead text-light mb-3"
          style={{ backgroundImage: `url(${cube.imageUrl})` }}
        >
          <div
            className="mask"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          >
            <Container className="h-100">
              <Row className="mt-3 my-md-4">
                <BackButton buttonText="Back to cubes" path={`/cubes/`} />
              </Row>
              <Row className="h-100 align-items-center">
                <Col className="text-center">
                  {isAdmin && (
                    <Link
                      to={`/cubes/${cube.id}/edit`}
                      className="btn btn-primary btn-lg"
                    >
                      Admin: Edit cube
                    </Link>
                  )}
                  <h1 className="display-1">{cube.title}</h1>
                  <p className="small icon-link">
                    <PenFill /> Cube Designer: {cube.owner}
                  </p>
                  <Col xs={10} sm={8} md={6} className="d-grid gap-2 mx-auto">
                    <Link
                      to={cube.url}
                      target="_blank"
                      className="btn btn-primary btn-lg"
                    >
                      <BoxArrowUpRight className="fs-4" /> View list
                    </Link>
                  </Col>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
        <Container className="mt-3 my-md-4">
          <Row>
            <Col xs="10" md="8" className="d-grid gap-2 mx-auto">
              <p className="lead">{cube.description}</p>
            </Col>
          </Row>
          {cube.cardlist && (
            <Row>
              <h2>Cards {cube.cardlist.cards.length}</h2>

              {colors.map((color) => {
                return (
                  <Col xs={6} sm={4} lg={2} key={color}>
                    <h3>{colorSymbolToHeading(color)}</h3>
                    <Table striped borderless responsive>
                      <tbody>
                        {cube.cardlist.cards
                          .filter(
                            (lc) =>
                              lc.card.colors.length === 1 &&
                              lc.card.colors[0] === color
                          )
                          .map((listedCard, index) => (
                            <tr key={index}>
                              <td className="small p-1">
                                {listedCard.card.name}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </Col>
                );
              })}
            </Row>
          )}
        </Container>
      </>
    );
  } else {
    return <Loading />;
  }
};

export default ViewCubeGeneral;
