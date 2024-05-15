import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import cards from "../cards_no_duplicates.json";
import { Color, SimpleCard } from "../dto/card.dto";
import { Card } from "../entity/Card";
const cardsArray = cards as Card[];

export class CardService {
  private appDataSource: DataSource;
  private repository: Repository<Card>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Card);
  }

  async generateCardDb(): Promise<Card[]> {
    console.log("call generate db");
    const cards: Card[] = [];
    try {
      cardsArray.forEach(async (card) => {
        let colors: Color[] = [];
        if (card.colors) {
          card.colors.forEach((color) => {
            colors.push(color);
          });
        }
        const exists = await this.repository.exist({
          where: {
            scryfallId: card.scryfallId,
          },
        });
        if (card.scryfallId && !exists) {
          const dbCard = await this.repository.save({
            name: card.name,
            set: card.set,
            scryfallId: card.scryfallId,
            cmc: card.cmc ?? undefined,
            colors: colors ?? undefined,
            type: card.type,
          });
          cards.push(dbCard);
        }
      });
      return cards;
    } catch {
      return null;
    }
  }

  async getCardDb(): Promise<Card[]> {
    console.log("cards in json: " + cardsArray.length);
    return await this.repository.find();
  }

  async searchForCard(query: string): Promise<Card[]> {
    if (cardsArray) {
      return cardsArray
        .filter((card) =>
          card.name.toLowerCase().includes(decodeURI(query).toLowerCase())
        )
        .slice(0, 20);
    }
  }
}
