import cards from "../cards_no_duplicates.json";
import { Card } from "../dto/card.dto";
const cardsArray = cards as Card[];

export class CardService {
  constructor() {}

  async searchForCard(query: string): Promise<any> {
    if (cardsArray) {
      // console.log(cardsArray.length);
      return cardsArray
        .filter((card) =>
          card.name.toLowerCase().includes(decodeURI(query).toLowerCase())
        )
        .slice(0, 20);
    }
  }
}
