import express from "express";
import multer from "multer";
const upload = multer();

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
  getMostRecentRound,
  getCurrentMatch,
  getPreferences,
  getPreferencesForUser,
} from "../controller/tournament.controller";
import {
  getAllCubes,
  getCube,
  getCubesForTournament,
} from "../controller/cube.controller";
import {
  getPlayerMatchHistory,
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

userRouter.get(
  "/user/:userId/tournament/:tournamentId/matches",
  async (req, res, next) => {
    try {
      res.send(await getPlayerMatchHistory(req));
    } catch (err) {
      next(err);
    }
  }
);

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

userRouter.get("/tournament/:tournamentId", async (req, res, next) => {
  try {
    res.send(await getTournament(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get(
  "/tournament/:tournamentId/enrollment",
  async (req, res, next) => {
    try {
      res.send(await getTournamentEnrollments(req));
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get("/tournament/:tournamentId/drafts", async (req, res, next) => {
  try {
    res.send(await getTournamentAndDrafts(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get("/tournament/:tournamentId/round", async (req, res, next) => {
  try {
    res.send(await getCurrentRound(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get(
  "/tournament/:tournamentId/round/recent",
  async (req, res, next) => {
    try {
      res.send(await getMostRecentRound(req));
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get("/tournament/:tournamentId/draft", async (req, res, next) => {
  try {
    res.send(await getCurrentDraft(req));
  } catch (err) {
    next(err);
  }
});

userRouter.get(
  "/tournament/:tournamentId/round/:roundId/match/:userId",
  async (req, res, next) => {
    try {
      res.send(await getCurrentMatch(req));
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get(
  "/tournament/:tournamentId/preferences",
  async (req, res, next) => {
    try {
      res.send(await getPreferences(req));
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get(
  "/tournament/:tournamentId/preferences/:userId",
  async (req, res, next) => {
    try {
      res.send(await getPreferencesForUser(req));
    } catch (err) {
      next(err);
    }
  }
);

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

// todo: move tournament stuff to own router
userRouter.post(
  "/tournament/:tournamentId/enroll/:userId",
  async (req, res, next) => {
    try {
      res.send(await enrollIntoTournament(req));
    } catch (err) {
      next(err);
    }
  }
);

userRouter.post(
  "/tournament/:tournamentId/cancel/:userId",
  async (req, res, next) => {
    try {
      res.send(await cancelEnrollment(req));
    } catch (err) {
      next(err);
    }
  }
);

userRouter.post(
  "/tournament/:tournamentId/drop/:userId",
  async (req, res, next) => {
    try {
      res.send(await dropFromTournament(req));
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
