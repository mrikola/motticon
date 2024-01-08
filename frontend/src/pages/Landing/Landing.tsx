import { useContext, useEffect, useState } from "react";
import { Col, Container } from "react-bootstrap";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";
import { get } from "../../services/ApiService";
import { UsersTournaments } from "../../types/Tournament";
import { Link } from "react-router-dom";

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
          tournamentTypes.map((type, index) => {
            const tourneys = tournaments[type];
            return tourneys.length > 0 ? (
              <>
                <h2 key={index}>Your {type} tournaments</h2>
                {tourneys.map((tournament) => (
                  <div key={tournament.id}>
                    <Link to={`/tournament/${tournament.id}`}>
                      {tournament.name}
                    </Link>
                  </div>
                ))}
                </>
            ) : (
              <h2 key={index}>No {type} tournaments</h2>
            );
          })}
      </Col>
    </Container>
  ) : (
    <Container>Loading...</Container>
  );
};

export default Landing;
