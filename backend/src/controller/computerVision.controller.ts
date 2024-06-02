import { ListedCard } from "../entity/ListedCard";
import {
  ComputerVisionDto,
  ComputerVisionService,
} from "../service/computerVision.service";

const computerVisionService = new ComputerVisionService();

export const getListedCardsFromImageUrl = async (
  req
): Promise<ComputerVisionDto> => {
  const { url, cubeCards } = req.body;
  return await computerVisionService.getListedCardsFromImageUrl(url, cubeCards);
};

export const getTextFromUrl = async (req): Promise<ComputerVisionDto> => {
  const { url } = req.body;
  return await computerVisionService.getTextFromUrl(url);
};

export const textsToListedCards = async (req): Promise<ComputerVisionDto> => {
  const { rawTexts, dictionary } = req.body;
  return await computerVisionService.textsToListedCards(rawTexts, dictionary);
};
