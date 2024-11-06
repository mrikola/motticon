import { useState, useEffect, useContext } from "react";
import { get } from "../../services/ApiService";
import {
  Tournament,
  TournamentsByType,
  UsersTournaments,
} from "../../types/Tournament";
import { Col, Container, Row } from "react-bootstrap";
import dayjs from "dayjs";
import HelmetTitle from "../../components/general/HelmetTitle";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import TournamentCard from "../../components/general/TournamentCard";
import Loading from "../../components/general/Loading";

function Tournaments() {
  const [tournaments, setTournaments] = useState<TournamentsByType>();
  const [tournamentsStaffed, setTournamentsStaffed] = useState<Tournament[]>();
  const [tournamentsEnrolled, setTournamentsEnrolled] =
    useState<Tournament[]>();
  const user = useContext(UserInfoContext);
  const [tournamentsStaffedIds, setTournamentsStaffedIds] =
    useState<number[]>();
  const [tournamentsEnrolledIds, setTournamentsEnrolledIds] =
    useState<number[]>();
  const tournamentTypes: (keyof UsersTournaments)[] = [
    "ongoing",
    "future",
    "past",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await get("/tournament");
      const tournys = (await response.json()) as Tournament[];
      tournys.sort((a, b) => (a.startDate > b.startDate ? -1 : 1));
      setTournaments({
        ongoing: tournys.filter(
          (tournament) => tournament.status === "started"
        ),
        future: tournys.filter((tournament) => tournament.status === "pending"),
        past: tournys.filter((tournament) => tournament.status === "completed"),
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user && !tournamentsEnrolled) {
        const userTournys = await get(`/user/${user.id}/tournaments`);
        const enrollments = (await userTournys.json()) as Tournament[];
        setTournamentsEnrolled(enrollments);
      }
    };

    fetchData();
  }, [user, tournamentsStaffed]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && !tournamentsStaffed) {
        const response = await get(`/user/${user.id}/staff`);
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
      // console.log(ids);
    }
  }, [tournamentsStaffed]);

  useEffect(() => {
    if (!tournamentsEnrolledIds && tournamentsEnrolled) {
      const ids = [];
      for (const tournament in tournamentsEnrolled) {
        ids.push(tournamentsEnrolled[tournament].id);
      }
      setTournamentsEnrolledIds(ids);
      // console.log(ids);
    }
  }, [tournamentsEnrolled]);

  return user &&
    tournaments &&
    tournamentsStaffedIds &&
    tournamentsEnrolledIds ? (
    <Container className="mt-3 my-md-4">
      <HelmetTitle titleText="Tournaments" />
      <Row>
        <h1 className="display-1">Tournaments</h1>
      </Row>
      {tournaments &&
        tournamentTypes.map((type, index) => {
          const tourneys = tournaments[type];
          tourneys.sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
          return tourneys.length > 0 ? (
            <div key={index}>
              <h2 className="text-capitalize mt-2">{type} tournaments</h2>
              <Row key={index} className="row-cols-1 row-cols-md-2 g-2">
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
                      enrolledIds={tournamentsEnrolledIds}
                      date={date}
                      key={tournament.id}
                    />
                  );
                })}
              </Row>
            </div>
          ) : (
            <Row key={index}>
              <Col xs={12}>
                <h2 className="text-capitalize mt-2">No {type} tournaments</h2>
              </Col>
            </Row>
          );
        })}
    </Container>
  ) : (
    <Loading />
  );
}

export default Tournaments;
