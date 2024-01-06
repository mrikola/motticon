import { UserService } from "../service/user.service";

const userService = new UserService();

export const getUsersTournaments = async (req) => {
  const { id } = req.params;
  return await userService.getUsersTournaments(id as number);
};
