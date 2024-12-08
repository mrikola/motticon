import { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Cube } from "../../types/Cube";
import { get } from "../../services/ApiService";
import { PenFill, BoxArrowUpRight } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import Loading from "../../components/general/Loading";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { Color } from "../../types/Card";

const ViewCube = () => {
  const user = useContext(UserInfoContext);
  const isAdmin = user?.isAdmin;
  const { cubeId, tournamentId } = useParams();
  const [cube, setCube] = useState<Cube>();
  const colors: Color[] = ["W", "U", "B", "R", "G"];
  const cardtypes: string[] = [
    "Creature",
    "Planeswalker",
    "Instant",
    "Sorcery",
    "Enchantment",
    "Artifact",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/cube/${cubeId}`);
      const cube = (await resp.json()) as Cube;
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
                {tournamentId ? (
                  <BackButton
                    buttonText="Back to tournament cubes"
                    path={`/tournament/${tournamentId}/cubes/`}
                  />
                ) : (
                  <Row className="mt-3 my-md-4">
                    <BackButton buttonText="Back to cubes" path={`/cubes/`} />
                  </Row>
                )}
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
                      <div className="icon-link">
                        <BoxArrowUpRight className="fs-3" /> View list
                      </div>
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
              <h2>Cards {(cube.cardlist.cards ?? []).length}</h2>

              {colors.map((color) => {
                if (
                  (cube.cardlist?.cards ?? []).filter(
                    (lc) =>
                      lc.card &&
                      lc.card.colors.length === 1 &&
                      lc.card.colors[0] === color
                  ).length > 0
                ) {
                  return (
                    <Col xs={6} sm={4} lg={2} key={color}>
                      <h3>{colorSymbolToHeading(color)}</h3>
                      {cardtypes.map((cardtype, index) => {
                        const typeCards = (cube.cardlist?.cards ?? []).filter(
                          (lc) =>
                            lc.card &&
                            lc.card.colors.length === 1 &&
                            lc.card.colors[0] === color &&
                            lc.card.type.includes(cardtype)
                        );
                        if (typeCards.length > 0) {
                          return (
                            <Fragment key={index}>
                              <p className="lead">
                                {cardtype} ({typeCards.length})
                              </p>
                              <Table striped borderless responsive>
                                <tbody>
                                  {typeCards
                                    .sort(
                                      (a, b) =>
                                        (a.card?.cmc ?? 0) - (b.card?.cmc ?? 0)
                                    )
                                    .map((listedCard, index) => (
                                      <tr key={index}>
                                        <td className="small p-1">
                                          {listedCard.card?.name}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </Table>
                            </Fragment>
                          );
                        }
                      })}
                    </Col>
                  );
                }
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

export default ViewCube;
