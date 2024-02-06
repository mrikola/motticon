import { CardService } from "../service/card.service";

const cardService = new CardService();

export const searchForCard = async (req) => {
  const { query } = req.params;
  return await cardService.searchForCard(query);
};
