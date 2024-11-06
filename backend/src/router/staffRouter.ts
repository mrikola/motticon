import express from "express";
import { isValidStaffMemberToken } from "../auth/auth";
import { staffSubmitResult } from "../controller/match.controller";
import { setDraftPoolReturned } from "../controller/draft.controller";

export const staffRouter = express.Router();

const staffMiddleware = (req, res, next) => {
  if (
    !isValidStaffMemberToken(
      req.headers.authorization,
      Number(req.params.tournamentId)
    )
  ) {
    return res.sendStatus(401);
  }
  next();
};

staffRouter.use("/tournament/:tournamentId/*", staffMiddleware);
staffRouter.use("/staff/tournament/:tournamentId/*", staffMiddleware);

staffRouter.post(
  "/staff/tournament/:tournamentId/submitResult",
  async (req, res) => {
    res.send(await staffSubmitResult(req));
  }
);

staffRouter.post(
  "/tournament/:tournamentId/setDraftPoolReturned",
  async (req, res) => {
    res.send(await setDraftPoolReturned(req));
  }
);
