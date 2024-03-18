import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Col, Container, Row } from "react-bootstrap";
import { Cube } from "../../types/Cube";
import { get } from "../../services/ApiService";
import { PenFill, BoxArrowUpRight } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import Loading from "../../components/general/Loading";

const ViewCubeGeneral = () => {
  const { cubeId } = useParams();
  const [cube, setCube] = useState<Cube>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/cube/${cubeId}`);
      const cube = (await resp.json()) as Cube;
      setCube(cube);
    };

    fetchData();
  }, [cubeId]);

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
        </Container>
      </>
    );
  } else {
    return <Loading />;
  }
};

export default ViewCubeGeneral;
