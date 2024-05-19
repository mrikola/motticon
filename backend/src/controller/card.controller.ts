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

export const getCardById = async (req): Promise<Card> => {
  const { scryfallId } = req.params;
  return await cardService.getCardById(scryfallId);
};

export const getCardByName = async (req): Promise<Card> => {
  const { cardname } = req.params;
  return await cardService.getCardByName(cardname);
};

export const getCards = async (req): Promise<Card[]> => {
  const { cards } = req.params;
  return await cardService.getCards(cards);
};

export const searchForCard = async (req): Promise<Card[]> => {
  const { query } = req.params;
  return await cardService.searchForCard(query);
};
