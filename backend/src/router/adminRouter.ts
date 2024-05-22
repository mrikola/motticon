import express from "express";
import { isValidAdminToken } from "../auth/auth";
import {
  addToStaff,
  createTournament,
  getTournamentStaff,
  removeFromStaff,
} from "../controller/tournament.controller";
import { resetEloForUser, updateElo } from "../controller/rating.controller";
import { addCube, editCube } from "../controller/cube.controller";
import {
  setDeckPhotoForUser,
  submitRandomPool,
} from "../controller/draft.controller";
import { deleteUser } from "../controller/user.controller";
import {
  generateCardDb,
  getCardDb,
  playerReturnedCards,
} from "../controller/card.controller";
import { generateDryRunUsers } from "../controller/dry-run.controller";

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

adminRouter.post(
  "/tournament/:tournamentId/staff/:userId/add",
  async (req, res) => {
    res.send(await addToStaff(req));
  }
);

adminRouter.post(
  "/tournament/:tournamentId/staff/:userId/remove",
  async (req, res) => {
    res.send(await removeFromStaff(req));
  }
);

adminRouter.post("/setDeckPhoto", async (req, res) => {
  res.send(await setDeckPhotoForUser(req));
});

// admin-only helper function
adminRouter.post("/submitRandomPool", async (req, res) => {
  res.send(await submitRandomPool(req));
});

adminRouter.get("/tournament/:tournamentId/staff", async (req, res) => {
  res.send(await getTournamentStaff(req));
});

adminRouter.get("/dryrunusers", async (req, res) => {
  res.send(await generateDryRunUsers());
});

adminRouter.get("/generateCardDb", async (req, res) => {
  res.send(await generateCardDb(req));
});

adminRouter.get("/getCardDb", async (req, res) => {
  res.send(await getCardDb(req));
});

adminRouter.get(
  "/cube/:id/pickedCards/return/:playerId",
  async (req, res, next) => {
    try {
      res.send(await playerReturnedCards(req));
    } catch (err) {
      next(err);
    }
  }
);

// adminRouter.get(
//   "/cube/:cubeId/pickedCards/generateRandom/:playerId",
//   async (req, res, next) => {
//     try {
//       res.send(await setRandomPickedCards(req));
//     } catch (err) {
//       next(err);
//     }
//   }
// );
