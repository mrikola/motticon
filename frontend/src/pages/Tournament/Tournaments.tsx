import { useContext, useMemo } from "react";
import { get } from "../../services/ApiService";
import {
  Tournament,
  TournamentsByType,
  UsersTournaments,
} from "../../types/Tournament";
import { Col, Row } from "react-bootstrap";
import dayjs from "dayjs";
import HelmetTitle from "../../components/general/HelmetTitle";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import TournamentCard from "../../components/general/TournamentCard";
import Loading from "../../components/general/Loading";
import { useFetch } from "../../hooks/useFetch";
import PageContainer from "../../components/general/PageContainer";

function Tournaments() {
  const user = useContext(UserInfoContext);
  const tournamentTypes: (keyof UsersTournaments)[] = [
    "ongoing",
    "future",
    "past",
  ];

  const { data: allTournaments, loading: tournamentsLoading } = useFetch<
    Tournament[]
  >(async () => {
    const response = await get("/tournament");
    const tournys = (await response.json()) as Tournament[];
    const sortedTournys = [...tournys].sort((a, b) =>
      a.startDate > b.startDate ? -1 : 1
    );
    return sortedTournys;
  }, []);

  const tournaments = useMemo<TournamentsByType | undefined>(() => {
    if (!allTournaments) return undefined;
    return {
      ongoing: allTournaments.filter(
        (tournament) => tournament.status === "started"
      ),
      future: allTournaments.filter(
        (tournament) => tournament.status === "pending"
      ),
      past: allTournaments.filter(
        (tournament) => tournament.status === "completed"
      ),
    };
  }, [allTournaments]);

  const { data: tournamentsEnrolled, loading: enrolledLoading } = useFetch<
    Tournament[]
  >(
    async () => {
      if (!user) return [];
      const userTournys = await get(`/user/${user.id}/tournaments`);
      return (await userTournys.json()) as Tournament[];
    },
    [user?.id],
    { enabled: !!user }
  );

  const { data: tournamentsStaffed, loading: staffedLoading } = useFetch<
    Tournament[]
  >(
    async () => {
      if (!user) return [];
      const response = await get(`/user/${user.id}/staff`);
      return (await response.json()) as Tournament[];
    },
    [user?.id],
    { enabled: !!user }
  );

  const tournamentsStaffedIds = useMemo(() => {
    if (!tournamentsStaffed) return undefined;
    return tournamentsStaffed.map((tournament) => tournament.id);
  }, [tournamentsStaffed]);

  const tournamentsEnrolledIds = useMemo(() => {
    if (!tournamentsEnrolled) return undefined;
    return tournamentsEnrolled.map((tournament) => tournament.id);
  }, [tournamentsEnrolled]);

  if (
    tournamentsLoading ||
    enrolledLoading ||
    staffedLoading ||
    !user ||
    !tournaments ||
    !tournamentsStaffedIds ||
    !tournamentsEnrolledIds
  ) {
    return <Loading />;
  }

  return (
    <PageContainer>
      <HelmetTitle titleText="Tournaments" />
      <Row>
        <h1 className="display-1">Tournaments</h1>
      </Row>
      {tournaments &&
        tournamentTypes.map((type, index) => {
          const tourneys = tournaments[type];
          const sortedTourneys = [...tourneys].sort((a, b) =>
            a.startDate < b.startDate ? -1 : 1
          );
          return sortedTourneys.length > 0 ? (
            <div key={index}>
              <h2 className="text-capitalize mt-2">{type} tournaments</h2>
              <Row key={index} className="row-cols-1 row-cols-md-2 g-2">
                {sortedTourneys.map((tournament) => {
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
    </PageContainer>
  );
}

export default Tournaments;
