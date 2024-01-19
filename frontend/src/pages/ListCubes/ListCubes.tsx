import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, ExclamationCircleFill } from "react-bootstrap-icons";
import { get } from "../../services/ApiService";
import { Cube } from "../../types/Cube";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import styles from "./ListCubes.module.css";
import Loading from "../../components/general/Loading";

const ListCubes = () => {
  const [cubes, setCubes] = useState<Cube[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get("/cube");
      const cubes = (await resp.json()) as Cube[];
      setCubes(cubes);
    };

    fetchData();
  }, []);

  return cubes ? (
    <Container className="mt-3 my-md-4">
      <Row>
        <h1 className="display-1">Cubes</h1>
      </Row>
      <Row xs={1} sm={1} md={2}>
        {cubes.map((cube, index) => (
          <Col key={cube.id}>
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
                      <small>Designed by {cube.owner}</small>
                    </div>
                    <Link to={`/cube/${cube.id}`}>
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
  ) : (
    <Loading />
  );
};

export default ListCubes;
