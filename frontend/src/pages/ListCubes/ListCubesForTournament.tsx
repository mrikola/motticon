import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  Box,
  ExclamationCircleFill,
  BoxArrowInLeft,
} from "react-bootstrap-icons";
import { get } from "../../services/ApiService";
import { Cube } from "../../types/Cube";
import { Tournament } from "../../types/Tournament";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import styles from "./ListCubes.module.css";

const ListCubesForTournament = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [tournament, setTournament] = useState<Tournament>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/cubes`);
      const tournamentCubes = (await resp.json()) as Cube[];
      setCubes(tournamentCubes);
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

  if (user && tournament) {
    return (
      <Container className="mt-3 my-md-4">
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
              <Card className={styles.cubeCard}>
                <Row>
                  <Col
                    xs={6}
                    className="cube-card-image rounded-start"
                    style={{
                      backgroundImage:
                        'url("/img/masthead_' + (index + 1) + '.jpeg")',
                    }}
                  ></Col>
                  <Col xs={6}>
                    <Card.Body className={styles.cubeCardBody}>
                      <Card.Title>
                        {cube.title + " "}
                        {cube.id === 1 && (
                          <ExclamationCircleFill className="text-primary" />
                        )}
                      </Card.Title>
                      <Card.Text>{cube.description}</Card.Text>
                      <div className="cube-designer mb-2">
                        <small>Designed by Timo Tuuttari</small>
                      </div>
                      <Link to={`/tournament/${tournamentId}/cubes/${cube.id}`}>
                        <Button variant="primary">
                          <Box /> Go to cube
                        </Button>
                      </Link>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  } else {
    return <>no user lul</>;
  }
};

export default ListCubesForTournament;
