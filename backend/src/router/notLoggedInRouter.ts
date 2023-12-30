import * as express from "express";
import { doLogin } from "../auth/auth";

export const notLoggedInRouter = express.Router();

// TODO add stuff about creating a new user
notLoggedInRouter.post("/signup", async (req, res) => {});

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
