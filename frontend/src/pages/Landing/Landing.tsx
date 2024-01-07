import { useContext, useEffect, useState } from "react";
import { Col, Container } from "react-bootstrap";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { get } from "../../services/ApiService";
import { UsersTournaments } from "../../types/Tournament";

const Landing = () => {
  const [tournaments, setTournaments] = useState<UsersTournaments>();
  const user = useContext(UserInfoContext);

  useEffect(() => {
    const fetchData = async () => {
      if (user && !tournaments) {
        const response = await get(`/user/${user?.id}/tournaments`);
        setTournaments((await response.json()) as UsersTournaments);
      }
    };

    fetchData();
  }, [user, tournaments, get]);

  const tournamentTypes: (keyof UsersTournaments)[] = [
    "ongoing",
    "future",
    "past",
  ];

  return user && tournaments ? (
    <Container className="mt-3 my-md-4">
      <Col>
        <h1 className="display-1">
          Welcome, {user?.firstName} {user?.lastName}
        </h1>
        {user.isAdmin && (
          <>You're an admin, some admin panel links should be here</>
        )}
        {tournaments &&
          tournamentTypes.map((type) => {
            const tourneys = tournaments[type];
            return tourneys.length > 0 ? (
              <>
                <h2>Your {type} tournaments</h2>
                {tourneys.map((tournament) => (
                  <div key={tournament.id}>{tournament.name}</div>
                ))}
              </>
            ) : (
              <></>
            );
          })}
      </Col>
    </Container>
  ) : (
    <Container>Loading...</Container>
  );
};

export default Landing;
