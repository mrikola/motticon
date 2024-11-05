import express from "express";
import { doLogin } from "../auth/auth";
import {
  generateDryRunPods,
  generateDryRunUsers,
} from "../controller/dry-run.controller";
import { generateCsvFromRound } from "../controller/tournament.controller";

export const notLoggedInRouter = express.Router();

notLoggedInRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const jwt = await doLogin(email, password);
  if (!jwt) {
    res.sendStatus(401);
  } else {
    res.send(jwt);
  }
});

// TODO nice to have: password reset
notLoggedInRouter.post("/forgot-password", (req, res) => {});

notLoggedInRouter.get("/dry-run/users", async (req, res) => {
  await generateDryRunUsers();
  res.sendStatus(201);
});

notLoggedInRouter.get("/dry-run", async (req, res) => {
  await generateDryRunPods(req.query.live !== undefined);
  res.sendStatus(201);
});

notLoggedInRouter.get(
  "/tournament/:tournamentId/round/:roundId/results",
  async (req, res, next) => {
    try {
      const resultsFile = await generateCsvFromRound(
        req.params.roundId,
        req.params.tournamentId
      );
      res.download(resultsFile);
    } catch (err) {
      next(err);
    }
  }
);
