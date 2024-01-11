import * as express from "express";
import { isValidToken } from "../auth/auth";
import {
  getAllTournaments,
  getTournament,
  getCurrentDraft,
  getCurrentRound,
  signupForTournament,
} from "../controller/tournament.controller";
import {
  getAllCubes,
  getCube,
  getCubesForTournament,
} from "../controller/cube.controller";
import {
  getUserTournamentInfo,
  getUsersTournaments,
  getTournamentsStaffed,
  getCurrentDraftAndMatch,
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
  "/user/:userId/tournament/:tournamentId/current",
  async (req, res) => {
    res.send(await getCurrentDraftAndMatch(req));
  }
);

userRouter.get(
  "/user/:userId/tournament/:tournamentId/matches",
  async (req, res) => {
    res.send(await getPlayerMatchHistory(req));
  }
);

userRouter.get("/user/:userId/staff", async (req, res) => {
  res.send(await getTournamentsStaffed(req));
});

userRouter.get("/cube", async (req, res) => {
  res.send(await getAllCubes());
});

userRouter.get("/cube/:id", async (req, res) => {
  res.send(await getCube(req));
});

userRouter.get("/tournaments", async (req, res) => {
  res.send(await getAllTournaments());
});

userRouter.get("/tournament/:id", async (req, res) => {
  res.send(await getTournament(req));
});

userRouter.get("/tournament/:id/round", async (req, res) => {
  res.send(await getCurrentRound(req));
});

userRouter.get("/tournament/:id/draft", async (req, res) => {
  res.send(await getCurrentDraft(req));
});

// userRouter.get("/tournament/:id/cubes", async (req, res) => {
//   res.send(await getTournamentCubes(req));
// });

userRouter.get("/tournament/:id/cubes", async (req, res) => {
  res.send(await getCubesForTournament(req));
});

// todo: move tournament stuff to own router
userRouter.post("/tournament/signup", async (req, res) => {
  const { tournamentId, userId } = req.body;
  res.send(await signupForTournament(req));
});
