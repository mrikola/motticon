import * as cards from "../cards_no_duplicates.json";
import { Card } from "../dto/card.dto";
const cards_object = cards as Card[];

export class CardService {
  constructor() {}

  async searchForCard(query: string): Promise<any> {
    return cards_object
      .filter((card) =>
        card.name.toLowerCase().includes(decodeURI(query).toLowerCase())
      )
      .slice(0, 20);
  }
}
