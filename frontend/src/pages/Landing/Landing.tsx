import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { get } from "../../services/ApiService";
import { Tournament, UsersTournaments } from "../../types/Tournament";
import dayjs from "dayjs";
import HelmetTitle from "../../components/general/HelmetTitle";
import TournamentCard from "../../components/general/TournamentCard";
import Loading from "../../components/general/Loading";

const Landing = () => {
  const [tournaments, setTournaments] = useState<UsersTournaments>();
  const [tournamentsStaffed, setTournamentsStaffed] = useState<Tournament[]>();
  const user = useContext(UserInfoContext);
  const [tournamentsStaffedIds, setTournamentsStaffedIds] =
    useState<number[]>();

  useEffect(() => {
    const fetchData = async () => {
      if (user && !tournaments) {
        const response = await get(`/user/${user?.id}/tournaments`);
        setTournaments((await response.json()) as UsersTournaments);
      }
    };

    fetchData();
  }, [user, tournaments]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && !tournamentsStaffed) {
        const response = await get(`/user/${user?.id}/staff`);
        setTournamentsStaffed(await response.json());
      }
    };

    fetchData();
  }, [user, tournamentsStaffed]);

  useEffect(() => {
    if (!tournamentsStaffedIds && tournamentsStaffed) {
      const ids = [];
      for (const tournament in tournamentsStaffed) {
        ids.push(tournamentsStaffed[tournament].id);
      }
      setTournamentsStaffedIds(ids);
      console.log(ids);
    }
  }, [tournamentsStaffed]);

  const tournamentTypes: (keyof UsersTournaments)[] = [
    "ongoing",
    "future",
    "past",
  ];

  return user && tournaments && tournamentsStaffedIds ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText="Home" />
      <Col>
        <h1 className="display-1">
          Welcome, {user?.firstName} {user?.lastName}
        </h1>
        {tournaments &&
          tournamentTypes.map((type, index) => {
            const tourneys = tournaments[type];
            return tourneys.length > 0 ? (
              <div key={index}>
                <h2 className="text-capitalize my-2">
                  Your {type} tournaments
                </h2>
                <Row className="row-cols-1 row-cols-md-2 g-2">
                  {tourneys.map((tournament) => {
                    let date;
                    if (
                      dayjs(tournament.startDate).isSame(
                        dayjs(tournament.endDate),
                        "day"
                      )
                    ) {
                      date = dayjs(tournament.startDate).format("DD/MM/YYYY");
                    } else {
                      date =
                        dayjs(tournament.startDate).format("DD/MM/YYYY") +
                        " - " +
                        dayjs(tournament.endDate).format("DD/MM/YYYY");
                    }
                    return (
                      <TournamentCard
                        tournament={tournament}
                        staffedIds={tournamentsStaffedIds}
                        date={date}
                        key={tournament.id}
                      />
                    );
                  })}
                </Row>
              </div>
            ) : (
              <h2 key={index} className="text-capitalize my-2">
                You have no {type} tournaments
              </h2>
            );
          })}
      </Col>
    </Container>
  ) : (
    <Loading />
  );
};

export default Landing;
