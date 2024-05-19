import { ComputerVisionService } from "../service/computerVision.service";

const computerVisionService = new ComputerVisionService();

export const getCardsFromImageUrl = async (req): Promise<string[]> => {
  const { url, dictionary } = req.body;
  return await computerVisionService.getCardsFromImageUrl(url, dictionary);
};

export const getTextFromUrl = async (req): Promise<string[]> => {
  const { url } = req.body;
  return await computerVisionService.getTextFromUrl(url);
};

export const textsToMagicCards = async (req): Promise<string[]> => {
  const { rawTexts, dictionary } = req.body;
  return await computerVisionService.textsToMagicCards(rawTexts, dictionary);
};
