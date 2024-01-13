import { hashSync, compareSync } from "bcrypt";
import { verify, sign, JwtPayload } from "jsonwebtoken";
import { UserService } from "../service/user.service";

const { JWT_SECRET_KEY } = process.env;
const userService = new UserService();

export const isValidToken = (token: string) => {
  try {
    const decoded = verify(token, JWT_SECRET_KEY);
    return true;
  } catch (err: unknown) {
    return false;
  }
};

export const isValidAdminToken = (token: string) => {
  try {
    const decoded = verify(token, JWT_SECRET_KEY) as JwtPayload;
    return decoded.isAdmin;
  } catch (err: unknown) {
    return false;
  }
};

// TODO: use this for signup purposes
export const encodePassword = (password: string) => hashSync(password, 10);

export const doLogin = async (email: string, password: string) => {
  const user = await userService.getUserByEmail(email);

  if (!user || !compareSync(password, user.password)) {
    // TODO log the login error
    return undefined;
  }

  return sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      tournamentsStaffed:
        user.tournamentsStaffed?.map((tournament) => tournament.id) ?? [],
    },
    JWT_SECRET_KEY
  );
};
