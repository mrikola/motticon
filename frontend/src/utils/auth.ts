import { jwtDecode } from "jwt-decode";

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
