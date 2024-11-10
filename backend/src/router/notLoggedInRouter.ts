import express from "express";
import {
  generateDryRunPods,
  generateDryRunUsers,
} from "../controller/dry-run.controller";

export const notLoggedInRouter = express.Router();

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

