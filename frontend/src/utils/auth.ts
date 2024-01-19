import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { UserInfoContext } from "../components/provider/UserInfoProvider";

export type LoggedInUser = {
  id: number;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  tournamentsStaffed: number[];
};

export const getUserInfoFromJwt = async (jwt: string) => {
  const decoded = jwtDecode<LoggedInUser>(jwt);
  if (decoded) {
    const { id, firstName, lastName, isAdmin, tournamentsStaffed } = decoded;
    return JSON.stringify({
      id,
      firstName,
      lastName,
      isAdmin,
      tournamentsStaffed,
    });
  }
  return "";
};

export const useIsAdmin = () => {
  const user = useContext(UserInfoContext);
  const navigate = useNavigate();

  if (user && !user.isAdmin) {
    navigate("/");
  }
  return user;
};

export const useIsTournamentStaff = (tournamentId: number) => {
  const user = useContext(UserInfoContext);
  const navigate = useNavigate();

  if (
    user &&
    !user.isAdmin &&
    !user.tournamentsStaffed.includes(tournamentId)
  ) {
    navigate("/");
  }
  return user;
};
