import { Card } from "../entity/Card";
import { CardService } from "../service/card.service";

const cardService = new CardService();

export const generateCardDb = async (req): Promise<Card[]> => {
  console.log("controller called");
  return await cardService.generateCardDb();
};

export const getCardDb = async (req): Promise<Card[]> => {
  return await cardService.getCardDb();
};

export const getCard = async (req): Promise<Card> => {
  const { scryfallId } = req.params;
  return await cardService.getCard(scryfallId);
};

export const searchForCard = async (req): Promise<Card[]> => {
  const { query } = req.params;
  return await cardService.searchForCard(query);
};
