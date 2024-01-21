import * as express from "express";
import { isValidToken } from "../auth/auth";
import {
  getAllTournaments,
  getTournament,
  getCurrentDraft,
  getCurrentRound,
  enrollIntoTournament,
  cancelEnrollment,
  dropFromTournament,
  getFutureTournaments,
  getPastTournaments,
  getOngoingTournaments,
  getTournamentAndDrafts,
  getTournamentEnrollments,
  staffCancelEnrollment,
  startTournament,
  generateDrafts,
  startDraft,
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
  getUser,
  getAllUsers,
} from "../controller/user.controller";
import {
  getPlayerMatchHistory,
  submitResult,
  staffSubmitResult,
  getMatchesForRound,
} from "../controller/match.controller";
import {
  getPodsForDraft,
  getSeatsForPod,
} from "../controller/draft.controller";

export const userRouter = express.Router();

userRouter.use((req, res, next) => {
  if (!isValidToken(req.headers.authorization)) {
    return res.sendStatus(401);
  }
  next();
});

userRouter.get("/user/:id/tournaments", async (req, res) => {
  res.send(await getUsersTournaments(req));
});

userRouter.get("/user/:userId/tournament/:tournamentId", async (req, res) => {
  res.send(await getUserTournamentInfo(req));
});

userRouter.get("/match/round/:roundId", async (req, res) => {
  res.send(await getMatchesForRound(req));
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

userRouter.post("/submitResult", async (req, res) => {
  res.send(await submitResult(req));
});

userRouter.post("/staff/submitResult", async (req, res) => {
  res.send(await staffSubmitResult(req));
});

userRouter.get("/user/:userId/staff", async (req, res) => {
  res.send(await getTournamentsStaffed(req));
});

userRouter.get("/user/:id", async (req, res) => {
  res.send(await getUser(req));
});

userRouter.get("/user", async (req, res) => {
  res.send(await getAllUsers());
});

userRouter.get("/cube", async (req, res) => {
  res.send(await getAllCubes());
});

userRouter.get("/cube/:id", async (req, res) => {
  res.send(await getCube(req));
});

userRouter.get("/draft/pods/:draftId", async (req, res) => {
  res.send(await getPodsForDraft(req));
});

userRouter.get("/draft/seats/:draftPodId", async (req, res) => {
  res.send(await getSeatsForPod(req));
});

userRouter.get("/tournaments", async (req, res) => {
  res.send(await getAllTournaments());
});

userRouter.get("/tournaments/future", async (req, res) => {
  res.send(await getFutureTournaments());
});

userRouter.get("/tournaments/past", async (req, res) => {
  res.send(await getPastTournaments());
});

userRouter.get("/tournaments/ongoing", async (req, res) => {
  res.send(await getOngoingTournaments());
});

userRouter.get("/tournament/:tournamentId", async (req, res) => {
  res.send(await getTournament(req));
});

userRouter.get("/tournament/:tournamentId/enrollment", async (req, res) => {
  res.send(await getTournamentEnrollments(req));
});

userRouter.get("/tournament/:tournamentId/drafts", async (req, res) => {
  res.send(await getTournamentAndDrafts(req));
});

userRouter.get("/tournament/:tournamentId/round", async (req, res) => {
  res.send(await getCurrentRound(req));
});

userRouter.get("/tournament/:tournamentId/draft", async (req, res) => {
  res.send(await getCurrentDraft(req));
});

userRouter.get("/tournament/:id/cubes", async (req, res) => {
  res.send(await getCubesForTournament(req));
});

userRouter.put("/tournament/:tournamentId/start", async (req, res) => {
  res.send(await startTournament(req));
});

userRouter.post(
  "/tournament/:tournamentId/draft/generate",
  async (req, res) => {
    res.send(await generateDrafts(req));
  }
);

userRouter.put(
  "/tournament/:tournamentId/draft/:draftId/start",
  async (req, res) => {
    res.send(await startDraft(req));
  }
);

// todo: move tournament stuff to own router
userRouter.post(
  "/tournament/:tournamentId/enroll/:userId",
  async (req, res) => {
    res.send(await enrollIntoTournament(req));
  }
);

userRouter.post(
  "/tournament/:tournamentId/cancel/:userId",
  async (req, res) => {
    res.send(await cancelEnrollment(req));
  }
);

userRouter.post(
  "/staff/tournament/:tournamentId/cancel/:userId",
  async (req, res) => {
    res.send(await staffCancelEnrollment(req));
  }
);

userRouter.post("/tournament/:tournamentId/drop/:userId", async (req, res) => {
  res.send(await dropFromTournament(req));
});
