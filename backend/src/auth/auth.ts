import { hashSync, compareSync } from "bcrypt";
import { verify, sign, JwtPayload } from "jsonwebtoken";
import { UserService } from "../service/user.service";
import { Container } from "../container";
import { Request } from "express";

const { JWT_SECRET_KEY } = process.env;

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

export const isValidStaffMemberToken = (
  token: string,
  tournamentId: number
) => {
  try {
    const decoded = verify(token, JWT_SECRET_KEY) as JwtPayload;
    return (
      decoded.isAdmin ||
      (decoded.tournamentsStaffed ?? []).includes(tournamentId)
    );
  } catch (err: unknown) {
    return false;
  }
};

// TODO: use this for signup purposes
export const encodePassword = (password: string) => hashSync(password, 10);

export const doLogin = async (email: string, password: string) => {
  const userService: UserService = Container.get("UserService");
  const user = await userService.getUserByEmail(email);

  if (!user || !compareSync(password, user.password)) {
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

export const getUserFromToken = (token: string) => {
  try {
    const decoded = verify(token, JWT_SECRET_KEY) as JwtPayload;
    const { id, firstName, lastName } = decoded;
    return { id, firstName, lastName };
  } catch (err: unknown) {
    return null;
  }
};

export const expressAuthentication = async (
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> => {
  const token = request.headers["authorization"];

  if (!token) {
    throw new Error("No token provided");
  }

  switch (securityName) {
    case "loggedIn":
      if (!isValidToken(token)) {
        throw new Error("Invalid token");
      }
      return getUserFromToken(token);

    case "staff":
      // For staff routes that need tournamentId
      const tournamentId = parseInt(request.params.tournamentId);
      if (!isValidStaffMemberToken(token, tournamentId)) {
        throw new Error("Insufficient staff privileges");
      }
      return getUserFromToken(token);

    case "admin":
      if (!isValidAdminToken(token)) {
        throw new Error("Insufficient admin privileges");
      }
      return getUserFromToken(token);

    default:
      throw new Error(`Unknown security scheme: ${securityName}`);
  }
};
