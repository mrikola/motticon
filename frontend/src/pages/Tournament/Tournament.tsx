import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../../components/provider/UserInfoProvider";

const Tournament = () => {
  const { tournamentId } = useParams();
  const user = useContext(UserInfoContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(
        `/user/${user?.id}/tournament/${tournamentId}`
      );
      // TODO types + view
      const { tournament, enrollment, preferences } = await response.json();
      sessionStorage.setItem("currentTournament", tournament.id);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return <>tournament {tournamentId}</>;
};

export default Tournament;
