import * as express from "express";
import { isValidAdminToken } from "../auth/auth";
import { resetRecentMatchesForTournament } from "../controller/tournament.controller";

export const adminRouter = express.Router();

adminRouter.use((req, res, next) => {
  if (!isValidAdminToken(req.headers.authorization)) {
    return res.sendStatus(401);
  }
  next();
});

adminRouter.get("/admin", (req, res) => {
  res.send("you got da powa");
});

adminRouter.post("/admin/reset/tournament/:tournamentId", async (req, res) => {
  res.send(await resetRecentMatchesForTournament(req));
});
