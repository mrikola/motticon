import express from "express";
import { isValidAdminToken } from "../auth/auth";
import { createTournament } from "../controller/tournament.controller";
import { resetEloForUser, updateElo } from "../controller/rating.controller";
import { addCube, editCube } from "../controller/cube.controller";
import { setDeckPhotoForUser } from "../controller/draft.controller";
import { deleteUser } from "../controller/user.controller";

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

adminRouter.post("/tournament/create", async (req, res) => {
  res.send(await createTournament(req));
});

adminRouter.post("/cube/add", async (req, res) => {
  res.send(await addCube(req));
});

adminRouter.post("/cube/edit", async (req, res) => {
  res.send(await editCube(req));
});

// just here for testing purposes
adminRouter.post("/updateElo", async (req, res) => {
  res.send(await updateElo(req));
});

adminRouter.get("/resetElo/:playerId", async (req, res) => {
  res.send(await resetEloForUser(req));
});

adminRouter.post("/deleteUser/:userId", async (req, res) => {
  res.send(await deleteUser(req));
});

adminRouter.post("/setDeckPhoto", async (req, res) => {
  res.send(await setDeckPhotoForUser(req));
});
