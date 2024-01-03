import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, ExclamationCircleFill } from "react-bootstrap-icons";
import { get } from "../../services/ApiService";
import { Cube } from "../../types/Cube";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import styles from "./ListCubes.module.css";

const ListCubes = () => {
  const user = useContext(UserInfoContext);
  const [cubes, setCubes] = useState<Cube[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get("/cube");
      const cubes = (await resp.json()) as Cube[];
      setCubes(cubes);
    };

    fetchData();
  }, []);

  if (user) {
    return (
      <Container>
        <Row>
          <h1>Cubes</h1>
        </Row>
        <Row xs={1} sm={1} md={2}>
          {cubes.map((cube) => (
            <Col key={cube.id}>
              <Card className={styles.cubeCard}>
                <Row>
                  <Col
                    className="cube-card-image"
                    style={{
                      backgroundImage: `url("/img/masthead_${cube.id}.jpeg")`,
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
                      <div>
                        <small>Designed by Timo Tuuttari</small>
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
    );
  } else {
    return <>no user lul</>;
  }
};

export default ListCubes;
