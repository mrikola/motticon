import express from "express";
import { isValidAdminToken } from "../auth/auth";
import {
  addToStaff,
  createTournament,
  getTournamentStaff,
  removeFromStaff,
} from "../controller/tournament.controller";
import { resetEloForUser, updateElo } from "../controller/rating.controller";
import {
  addCube,
  editCube,
  getCardlist,
  getCubeDiff,
  updateCubeCardlist,
} from "../controller/cube.controller";
import {
  setDeckPhotoForUser,
  submitRandomPool,
} from "../controller/draft.controller";
import {
  deleteOrphanListedCards,
  generateCardDb,
  getAllListedCards,
  getAllPickedCards,
  getAllTokens,
  getCardDb,
  playerReturnedCards,
  removeAllPickedCards,
  updateCardDb,
} from "../controller/card.controller";
import { generateDryRunUsers } from "../controller/dry-run.controller";

export const adminRouter = express.Router();

adminRouter.use((req, res, next) => {
  if (!isValidAdminToken(req.headers.authorization)) {
    res.sendStatus(401);
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

adminRouter.post("/cube/diff", async (req, res) => {
  res.send(await getCubeDiff(req));
});

adminRouter.post("/cube/updateCardList", async (req, res) => {
  res.send(await updateCubeCardlist(req));
});

// just here for testing purposes
adminRouter.post("/updateElo", async (req, res) => {
  res.send(await updateElo(req));
});

adminRouter.get("/resetElo/:playerId", async (req, res) => {
  res.send(await resetEloForUser(req));
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

adminRouter.get("/updateCardDb", async (req, res) => {
  res.send(await updateCardDb(req));
});

adminRouter.get("/getAllPickedCards", async (req, res) => {
  res.send(await getAllPickedCards(req));
});

adminRouter.get("/getAllTokens", async (req, res) => {
  res.send(await getAllTokens(req));
});

adminRouter.get(
  "/cube/:id/pickedCards/return/:seatId",
  async (req, res, next) => {
    try {
      res.send(await playerReturnedCards(req));
    } catch (err) {
      next(err);
    }
  }
);

adminRouter.get("/cardlist/:id", async (req, res) => {
  res.send(await getCardlist(req));
});

adminRouter.get("/listedcards/all", async (req, res) => {
  res.send(await getAllListedCards(req));
});

adminRouter.get("/listedcards/deleteOrphans", async (req, res) => {
  res.send(await deleteOrphanListedCards(req));
});

adminRouter.get("/pickedcards/removeAll", async (req, res) => {
  res.send(await removeAllPickedCards(req));
});

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
