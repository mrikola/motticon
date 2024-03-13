import express from "express";
import { doLogin } from "../auth/auth";
import { signup } from "../controller/user.controller";
import {
  generateDryRunPods,
  generateDryRunUsers,
} from "../controller/dry-run.controller";

export const notLoggedInRouter = express.Router();

// TODO add stuff about creating a new user
notLoggedInRouter.post("/signup", async (req, res) => {
  const result = await signup(req);
  if (result) {
    res.sendStatus(201); // CREATED
  } else {
    res.sendStatus(401); // UNAUTHORIZED
  }
});

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

notLoggedInRouter.post("/dry-run/users", async (req, res) => {
  await generateDryRunUsers();
  res.sendStatus(201);
});

notLoggedInRouter.post("/dry-run", async (req, res) => {
  await generateDryRunPods();
  res.sendStatus(201);
});
