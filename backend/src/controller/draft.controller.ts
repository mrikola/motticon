import { DraftService } from "../service/draft.service";

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
