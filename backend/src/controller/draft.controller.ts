import path = require("path");
import { getUserFromToken } from "../auth/auth";
import { DraftService } from "../service/draft.service";
import { FILE_ROOT, createDirIfNotExists } from "../util/fs";
import { writeFileSync } from "fs";
import mime from "mime-types";
import {
  DraftDto,
  DraftPodDto,
  DraftPodSeatDto,
  draftToDto,
  podToDto,
  seatToDto,
} from "../dto/draft.dto";
import { RoundDto, roundToDto } from "../dto/round.dto";

const draftService = new DraftService();

export const getPodsForDraft = async (req): Promise<DraftPodDto[]> => {
  const { draftId } = req.params;
  return (await draftService.getPodsForDraft(draftId as number)).map(podToDto);
};

export const getSeatsForPod = async (req): Promise<DraftPodSeatDto[]> => {
  const { draftPodId } = req.params;
  return (await draftService.getSeatsForPod(draftPodId as number)).map(
    seatToDto
  );
};

export const getRoundsForDraft = async (req): Promise<RoundDto[]> => {
  const { draftId } = req.params;
  return (await draftService.getRoundsForDraft(draftId as number)).map(
    roundToDto
  );
};

export const getDraftInfoForUser = async (req): Promise<DraftPodDto> => {
  const { draftId, userId } = req.params;
  return podToDto(
    await draftService.getDraftInfoForUser(draftId as number, userId as number)
  );
};

export const setDraftPoolReturned = async (req): Promise<DraftDto> => {
  const { tournamentId, seatId } = req.body;
  return draftToDto(
    await draftService.setDraftPoolReturned(
      tournamentId as number,
      seatId as number
    )
  );
};

export const setDeckPhotoForUser = async (req): Promise<DraftDto> => {
  const { tournamentId, seatId } = req.body;
  return draftToDto(
    await draftService.setDeckPhotoForUser(
      tournamentId as number,
      seatId as number
    )
  );
};

export const uploadDeckPhoto = async (req): Promise<DraftDto> => {
  const { tournamentId, seatId } = req.params;
  const user = getUserFromToken(req.headers.authorization);
  const file = req.file;

  const filePath = path.join(FILE_ROOT, tournamentId, seatId);
  const fileName = `${user.firstName}_${user.lastName}.${mime.extension(
    file.mimetype
  )}`;

  const fileUrl =
    `${req.protocol}://${req.headers.host}` + filePath + `/${fileName}`;

  createDirIfNotExists(filePath);
  const localFileFullPath = path.join(filePath, fileName);

  writeFileSync(localFileFullPath, file.buffer);
  return draftToDto(
    await draftService.setDeckPhotoForUser(tournamentId, seatId, fileUrl)
  );
};
