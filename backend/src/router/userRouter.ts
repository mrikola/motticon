import express from "express";
import multer from "multer";
const upload = multer();

import { isValidToken } from "../auth/auth";
import {
  getAllCubes,
  getCube,
  getCubesForTournament,
} from "../controller/cube.controller";
import {
  submitResult,
  getMatchesForRound,
} from "../controller/match.controller";
import {
  getDraftInfoForUser,
  getPodsForDraft,
  getRoundsForDraft,
  getSeatsForPod,
  setDeckPhotoForUser,
  uploadDeckPhoto,
} from "../controller/draft.controller";
import { getPreviousScore, getStandings } from "../controller/score.controller";
import {
  getCardById,
  getCardByName,
  getCards,
  searchForCard,
  setPickedCards,
} from "../controller/card.controller";
import { getListedCardsFromImageUrl } from "../controller/computerVision.controller";

export const userRouter = express.Router();

userRouter.use((req, res, next) => {
  if (!isValidToken(req.headers.authorization)) {
    res.sendStatus(401);
  }
  next();
});

userRouter.get("/match/round/:roundId", async (req, res, next) => {
  try {
    res.send(await getMatchesForRound(req));
  } catch (err) {
    next(err);
  }
});

userRouter.post("/submitResult", async (req, res, next) => {
  try {
    res.send(await submitResult(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get("/cube", async (req, res) => {
  res.send(await getAllCubes());
});

userRouter.get("/cube/:id", async (req, res, next) => {
  try {
    res.send(await getCube(req));
  } catch (err) {
    next(err);
  }
});

userRouter.post("/cube/:id/pickedCards/set", async (req, res, next) => {
  try {
    res.send(await setPickedCards(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get("/draft/pods/:draftId", async (req, res, next) => {
  try {
    res.send(await getPodsForDraft(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get("/draft/seats/:draftPodId", async (req, res, next) => {
  try {
    res.send(await getSeatsForPod(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get("/draft/:draftId/user/:userId", async (req, res, next) => {
  try {
    res.send(await getDraftInfoForUser(req));
  } catch (err) {
    next(err);
  }
});


userRouter.get("/tournament/:id/cubes", async (req, res, next) => {
  try {
    res.send(await getCubesForTournament(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get("/draft/:draftId/rounds", async (req, res, next) => {
  try {
    res.send(await getRoundsForDraft(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get(
  "/tournament/:tournamentId/standings/:roundNumber",
  async (req, res, next) => {
    try {
      res.send(await getStandings(req));
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get(
  "/tournament/:tournamentId/score/:userId",
  async (req, res, next) => {
    try {
      res.send(await getPreviousScore(req));
    } catch (err) {
      next(err);
    }
  }
);


userRouter.post("/setDeckPhoto", async (req, res) => {
  res.send(await setDeckPhotoForUser(req));
});

userRouter.post(
  "/tournament/:tournamentId/submitDeck/:seatId",
  upload.single("photo"),
  async (req, res, next) => {
    try {
      res.send(await uploadDeckPhoto(req));
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get("/card/search/:query", async (req, res, next) => {
  try {
    res.send(await searchForCard(req));
  } catch (err) {
    next(err);
  }
});

userRouter.post("/card/list", async (req, res, next) => {
  try {
    res.send(await getCards(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get("/card/id/:scryfallId", async (req, res, next) => {
  try {
    res.send(await getCardById(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get("/card/name/:cardname", async (req, res, next) => {
  try {
    res.send(await getCardByName(req));
  } catch (err) {
    next(err);
  }
});

userRouter.post("/computerVision/cardsFromImageUrl", async (req, res) => {
  res.send(await getListedCardsFromImageUrl(req));
});
