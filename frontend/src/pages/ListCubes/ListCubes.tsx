import { Link } from "react-router-dom";
import { PenFill } from "react-bootstrap-icons";
import { get } from "../../services/ApiService";
import { Cube } from "../../types/Cube";
import { Card, Col, Row } from "react-bootstrap";
import Loading from "../../components/general/Loading";
import { useFetch } from "../../hooks/useFetch";
import PageContainer from "../../components/general/PageContainer";

const ListCubes = () => {
  const { data: cubes, loading } = useFetch<Cube[]>(
    async () => {
      const resp = await get("/cube");
      return (await resp.json()) as Cube[];
    },
    []
  );

  if (loading || !cubes) {
    return <Loading />;
  }

  return (
    <PageContainer>
      <Row>
        <h1 className="display-1">All Cubes</h1>
      </Row>
      <Row xs={1} sm={1} md={2} xl={3} className="g-3">
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
                      <h3 className="pt-4 mt-5 mb-4 display-4 lh-1">
                        {cube.title + " "}
                      </h3>
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
    </PageContainer>
  );
};

export default ListCubes;
