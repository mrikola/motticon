import * as express from "express";
import { isValidToken } from "../auth/auth";
import { getAllCubes, getCube } from "../controller/cube.controller";
import { getAllTournaments, getTournament } from "../controller/tournament.controller";
import {
  getUserTournamentInfo,
  getUsersTournaments,
} from "../controller/user.controller";
import { getPlayerMatchHistory } from "../controller/match.controller";

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

userRouter.get("/user/:userId/tournament/:tournamentId", async (req, res) => {
  res.send(await getUserTournamentInfo(req));
});

userRouter.get(
  "/user/:userId/tournament/:tournamentId/matches",
  async (req, res) => {
    res.send(await getPlayerMatchHistory(req));
  }
);

userRouter.get("/cube", async (req, res) => {
  res.send(await getAllCubes());
});

userRouter.get("/cube/:id", async (req, res) => {
  res.send(await getCube(req));
});

userRouter.get("/tournaments", async (req, res) => {
  res.send(await getAllTournaments());
});
