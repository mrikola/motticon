import * as express from "express";
import { isValidToken } from "../auth/auth";
import { getAllCubes, getCube } from "../controller/cube.controller";
import { getUsersTournaments } from "../controller/user.controller";

export const userRouter = express.Router();

userRouter.use((req, res, next) => {
  if (!isValidToken(req.headers.authorization)) {
    return res.sendStatus(401);
  }
  next();
});

userRouter.get("/user/profile", (req, res) => {
  res.send("you da man now dawg");
});

userRouter.get("/user/:id/tournaments", async (req, res) => {
  res.send(await getUsersTournaments(req));
});

userRouter.get(
  "/user/:userId/tournament/:tournamentId/matches",
  async (req, res) => {
    res.send(await getUsersTournaments(req));
  }
);

userRouter.get("/cube", async (req, res) => {
  res.send(await getAllCubes());
});

userRouter.get("/cube/:id", async (req, res) => {
  res.send(await getCube(req));
});
