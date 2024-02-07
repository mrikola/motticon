import path = require("path");
import { getUserFromToken } from "../auth/auth";
import { DraftService } from "../service/draft.service";
import { createDirIfNotExists } from "../util/fs";
import { existsSync, writeFileSync } from "fs";
import * as mime from "mime-types";

const draftService = new DraftService();

export const getPodsForDraft = async (req) => {
  const { draftId } = req.params;
  return await draftService.getPodsForDraft(draftId as number);
};

export const getSeatsForPod = async (req) => {
  const { draftPodId } = req.params;
  return await draftService.getSeatsForPod(draftPodId as number);
};

export const getRoundsForDraft = async (req) => {
  const { draftId } = req.params;
  return await draftService.getRoundsForDraft(draftId as number);
};

export const getDraftInfoForUser = async (req) => {
  const { draftId, userId } = req.params;
  return await draftService.getDraftInfoForUser(
    draftId as number,
    userId as number
  );
};

export const setDeckPhotoForUser = async (req) => {
  const { tournamentId, seatId } = req.body;
  return await draftService.setDeckPhotoForUser(
    tournamentId as number,
    seatId as number
  );
};

export const uploadDeckPhoto = async (req) => {
  const { tournamentId, seatId } = req.params;
  const user = getUserFromToken(req.headers.authorization);
  const file = req.file;

  const photosRoot = "/photos";

  const filePath = path.join(photosRoot, tournamentId, seatId);
  const fileName = `${user.firstName}_${user.lastName}.${mime.extension(
    file.mimetype
  )}`;

  const fileUrl =
    `${req.protocol}://${req.headers.host}` + filePath + `/${fileName}`;

  createDirIfNotExists(filePath);
  const localFileFullPath = path.join(filePath, fileName);

  writeFileSync(localFileFullPath, file.buffer);
  return await draftService.setDeckPhotoForUser(tournamentId, seatId, fileUrl);
};
