import express from "express";
import { isValidStaffMemberToken } from "../auth/auth";
import {
  endDraft,
  endRound,
  endTournament,
  generateDrafts,
  staffCancelEnrollment,
  startDraft,
  startRound,
  startTournament,
} from "../controller/tournament.controller";
import { generatePairings } from "../controller/pairings.controller";
import { staffSubmitResult } from "../controller/match.controller";
import { setDraftPoolReturned } from "../controller/draft.controller";

export const staffRouter = express.Router();

staffRouter.use((req, res, next) => {
  if (
    !isValidStaffMemberToken(
      req.headers.authorization,
      Number(req.params.tournamentId)
    )
  ) {
    return res.sendStatus(401);
  }
  next();
});

staffRouter.put("/tournament/:tournamentId/start", async (req, res) => {
  res.send(await startTournament(req));
});

staffRouter.put("/tournament/:tournamentId/end", async (req, res) => {
  res.send(await endTournament(req));
});

staffRouter.post(
  "/tournament/:tournamentId/draft/generate",
  async (req, res) => {
    res.send(await generateDrafts(req));
  }
);

staffRouter.put(
  "/tournament/:tournamentId/draft/:draftId/start",
  async (req, res) => {
    res.send(await startDraft(req));
  }
);

staffRouter.put(
  "/tournament/:tournamentId/draft/:draftId/end",
  async (req, res) => {
    res.send(await endDraft(req));
  }
);

staffRouter.put(
  "/tournament/:tournamentId/round/:roundId/start",
  async (req, res) => {
    res.send(await startRound(req));
  }
);

staffRouter.put(
  "/tournament/:tournamentId/round/:roundId/end",
  async (req, res) => {
    res.send(await endRound(req));
  }
);

staffRouter.put(
  "/tournament/:tournamentId/draft/:draftId/round/:roundId/pairings",
  async (req, res) => {
    const { tournamentId, draftId, roundId } = req.params;
    res.send(
      await generatePairings(
        Number(tournamentId),
        Number(draftId),
        Number(roundId)
      )
    );
  }
);

staffRouter.post(
  "/staff/tournament/:tournamentId/cancel/:userId",
  async (req, res) => {
    res.send(await staffCancelEnrollment(req));
  }
);

staffRouter.post(
  "/staff/tournament/:tournamentId/submitResult",
  async (req, res) => {
    res.send(await staffSubmitResult(req));
  }
);

staffRouter.post("/setDraftPoolReturned", async (req, res) => {
  res.send(await setDraftPoolReturned(req));
});
