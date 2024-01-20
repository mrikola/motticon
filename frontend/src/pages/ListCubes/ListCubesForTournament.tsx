import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  Box,
  ExclamationCircleFill,
  BoxArrowInLeft,
  PenFill,
} from "react-bootstrap-icons";
import { get } from "../../services/ApiService";
import { Cube } from "../../types/Cube";
import { Tournament } from "../../types/Tournament";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import styles from "./ListCubes.module.css";
import Loading from "../../components/general/Loading";
import { Helmet, HelmetProvider } from "react-helmet-async";

const ListCubesForTournament = () => {
  const { tournamentId } = useParams();
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [tournament, setTournament] = useState<Tournament>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/cubes`);
      const tournamentCubes = (await resp.json()) as Cube[];
      setCubes(tournamentCubes);
      console.log(tournamentCubes);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}`);
      const tourny = (await resp.json()) as Tournament;
      setTournament(tourny);
    };
    fetchData();
  }, []);

  return tournament ? (
    <Container className="mt-3 my-md-4">
      <HelmetProvider>
        <Helmet>
          <title>MottiCon &#9632; {tournament.name} Cubes</title>
        </Helmet>
      </HelmetProvider>
      <Row>
        <Link to={`/tournament/${tournamentId}`}>
          <Button variant="primary">
            <BoxArrowInLeft /> Back to tournament
          </Button>
        </Link>
        <h1 className="display-1">{tournament.name} cubes</h1>
      </Row>
      <Row xs={1} sm={1} md={2}>
        {cubes.map((cube, index) => (
          <Col key={cube.id} className={cube.id.toString()}>
            <Card className="my-1">
              <Row>
                <Col
                  xs={6}
                  className="cube-card-image rounded-start"
                  style={{
                    backgroundImage:
                      'url("/img/masthead_' + (index + 1) + '.jpeg")',
                  }}
                ></Col>
                <Col xs={6} className="">
                  <Card.Body className="">
                    <Card.Title>
                      {cube.title + " "}
                      {cube.id === 1 && (
                        <ExclamationCircleFill className="text-primary" />
                      )}
                    </Card.Title>
                    <Card.Subtitle>
                      <PenFill /> {cube.owner}
                    </Card.Subtitle>
                    <Card.Text className="mt-2">{cube.description}</Card.Text>

                    <Link
                      to={`/tournament/${tournamentId}/cubes/${cube.id}`}
                      className="btn btn-primary"
                    >
                      <Box /> Go to cube
                    </Link>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default ListCubesForTournament;
