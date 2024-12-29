import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { PenFill } from "react-bootstrap-icons";
import { get } from "../../services/ApiService";
import { Cube } from "../../types/Cube";
import { Tournament } from "../../types/Tournament";
import { Badge, Card, Col, Container, Row } from "react-bootstrap";
import HelmetTitle from "../../components/general/HelmetTitle";
import BackButton from "../../components/general/BackButton";
import LoadingCubes from "../../components/general/LoadingCubes";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";

const ListCubesForTournament = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [tournament, setTournament] = useState<Tournament>();
  const [userCubes, setUserCubes] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await get(`/tournament/${tournamentId}/cubes`);
      const tournamentCubes = (await resp.json()) as Cube[];
      setCubes(tournamentCubes);
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const resp = await get(`/tournament/${tournamentId}`);
  //     const tourny = (await resp.json()) as Tournament;
  //     setTournament(tourny);
  //     console.log(tourny);
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const resp = await get(`/tournament/${tournamentId}/drafts`);
        const tourny = (await resp.json()) as Tournament;
        setTournament(tourny);
        const draftCubes = [];
        for (const draft of tourny.drafts) {
          for (const pod of draft.pods) {
            for (const seat of pod.seats) {
              if (seat.player?.id === user?.id) {
                draftCubes.push(pod.cube!.id);
              }
            }
          }
        }
        setUserCubes(draftCubes);
      };
      fetchData();
    }
  }, [user]);

  return tournament ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText={tournament.name + " Cubes"} />
      <Row>
        <BackButton
          buttonText="Back to tournament"
          path={`/tournament/${tournamentId}`}
        />
        <h1 className="display-1">{tournament.name}</h1>
        <h2 className="display-3">Cubes</h2>
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
                <Link
                  to={`/tournament/${tournamentId}/cubes/${cube.id}`}
                  className="card-link h-100"
                >
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
                  >
                    <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                      {userCubes.includes(cube.id) ? (
                        <>
                          <p className="mt-auto pt-4">
                            <Badge bg="primary" className="py-2">
                              Playing this cube
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
    <LoadingCubes />
  );
};

export default ListCubesForTournament;
