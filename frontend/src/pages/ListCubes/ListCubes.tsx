import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PenFill } from "react-bootstrap-icons";
import { get } from "../../services/ApiService";
import { Cube } from "../../types/Cube";
import { Badge, Card, Col, Container, Row } from "react-bootstrap";
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
        <h1 className="display-1">All Cubes</h1>
      </Row>
      <Row xs={1} sm={1} md={2} lg={3} className="g-3">
        {cubes.map((cube) => {
          let imageUrl;
          if (cube.imageUrl) {
            imageUrl = cube.imageUrl;
          } else {
            imageUrl =
              "https://cards.scryfall.io/art_crop/front/5/9/593cbbd0-6ec3-4506-be0c-a229f070ce6d.jpg";
          }
          return (
            <Col key={cube.id} xs={12} className="cube-card">
              <Card
                className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 cube-card-image"
                border="light"
                style={{
                  backgroundImage: "url(" + imageUrl + ")",
                }}
              >
                <Link to={`/cubes/${cube.id}`} className="card-link h-100">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
                  >
                    <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                      {cube.id === 1 ? (
                        <>
                          <p className="mt-auto pt-4">
                            <Badge bg="primary" className="py-2">
                              Test badge for preference indication
                            </Badge>
                          </p>
                          <h3 className="mb-4 display-4 lh-1">
                            {cube.title + " "}
                          </h3>
                        </>
                      ) : (
                        <h3 className="pt-4 mt-5 mb-4 display-4 lh-1">
                          {cube.title + " "}
                        </h3>
                      )}

                      <Card.Subtitle className="icon-link mt-auto">
                        <PenFill />{" "}
                        {cube.owner ? cube.owner : "Placeholder Name"}
                      </Card.Subtitle>
                      <hr></hr>
                      <p className="mb-0">Click to see more</p>
                    </div>
                  </div>
                </Link>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  ) : (
    <Loading />
  );
};

export default ListCubes;
