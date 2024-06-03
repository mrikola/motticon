import { Card } from "../entity/Card";
import { ListedCard } from "../entity/ListedCard";
import { PickedCard } from "../entity/PickedCard";
import { CardService } from "../service/card.service";

const cardService = new CardService();

export const generateCardDb = async (req): Promise<Card[]> => {
  return await cardService.generateCardDb();
};

export const getCardDb = async (req): Promise<Card[]> => {
  return await cardService.getCardDb();
};

export const updateCardDb = async (req): Promise<Card[]> => {
  return await cardService.updateCardDb();
};

// export const resetCardDb = async (req): Promise<boolean> => {
//   return await cardService.resetCardDb();
// };

export const getCardById = async (req): Promise<Card> => {
  const { scryfallId } = req.params;
  return await cardService.getCardById(scryfallId);
};

export const getCardByName = async (req): Promise<Card> => {
  const { cardname } = req.params;
  return await cardService.getCardByName(cardname);
};

export const getCards = async (req): Promise<Card[]> => {
  const { cards } = req.body;
  return await cardService.getCards(cards);
};

export const searchForCard = async (req): Promise<Card[]> => {
  const { query } = req.params;
  return await cardService.searchForCard(query);
};

export const setPickedCards = async (req): Promise<PickedCard[]> => {
  const { pickedCards } = req.body;
  return await cardService.setPickedCards(pickedCards);
};

export const playerReturnedCards = async (req): Promise<boolean> => {
  const { playerId } = req.params;
  return await cardService.playerReturnedCards(playerId);
};

export const getAllListedCards = async (req): Promise<ListedCard[]> => {
  return await cardService.getAllListedCards();
};

export const deleteOrphanListedCards = async (req): Promise<ListedCard[]> => {
  return await cardService.deleteOrphanListedCards();
};

// admin-only function to generate dummy picked cards for test users
// export const setRandomPickedCards = async (req): Promise<PickedCard[]> => {
//   const { picker } = req.body;
//   return await cardService.setRandomPickedCards(picker);
// };
