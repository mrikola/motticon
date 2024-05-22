import { DataSource, Like, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import cards from "../cards_no_duplicates.json";
import { Color } from "../dto/card.dto";
import { Card } from "../entity/Card";
import { ListedCard } from "../entity/ListedCard";
import { PickedCard } from "../entity/PickedCard";
import { DraftPodSeat } from "../entity/DraftPodSeat";
const cardsArray = cards as Card[];

type PickedCardDto = {
  listedCard: ListedCard;
  quantityPicked: number;
  picker: DraftPodSeat;
};

export class CardService {
  private appDataSource: DataSource;
  private cardRepository: Repository<Card>;
  private listedCardRepository: Repository<ListedCard>;
  private pickedCardRepository: Repository<PickedCard>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.cardRepository = this.appDataSource.getRepository(Card);
    this.listedCardRepository = this.appDataSource.getRepository(ListedCard);
    this.pickedCardRepository = this.appDataSource.getRepository(PickedCard);
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
        const exists = await this.cardRepository.exist({
          where: {
            scryfallId: card.scryfallId,
          },
        });
        if (card.scryfallId && !exists) {
          const dbCard = await this.cardRepository.save({
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

  async getCardById(scryfallId: string): Promise<Card> {
    return await this.cardRepository.findOne({
      where: { scryfallId },
    });
  }

  async getCardByName(cardname: string): Promise<Card> {
    const query = decodeURI(cardname);
    // look for exact match first
    let foundCard = await this.cardRepository.findOne({
      where: { name: query },
    });
    if (foundCard) {
      return foundCard;
    } else {
      // if not found, look for close match (relevant for e.g. double-faced cards)
      foundCard = await this.cardRepository.findOne({
        where: { name: Like(`%${query}%`) },
      });
    }
    if (foundCard) {
      // console.log("like query found " + foundCard.name);
      return foundCard;
    } else {
      // console.log("nothing found for: " + cardname);
      return null;
    }
  }

  async getCards(cards: string[]): Promise<Card[]> {
    const foundCards: Card[] = [];
    for (const card of cards) {
      const c = await this.getCardByName(card);
      foundCards.push(c);
    }
    return foundCards;
  }

  async getListedCardByName(cardname: string): Promise<ListedCard> {
    const query = decodeURI(cardname);
    // look for exact match first
    let foundCard = await this.listedCardRepository.findOne({
      where: {
        card: {
          name: query,
        },
      },
    });
    if (foundCard) {
      return foundCard;
    } else {
      // if not found, look for close match (relevant for e.g. double-faced cards)
      foundCard = await this.listedCardRepository.findOne({
        where: {
          card: {
            name: Like(`%${query}%`),
          },
        },
      });
    }
    if (foundCard) {
      // console.log("like query found " + foundCard.name);
      return foundCard;
    } else {
      // console.log("nothing found for: " + cardname);
      return null;
    }
  }

  async getListedCards(cards: string[]): Promise<ListedCard[]> {
    const foundCards: ListedCard[] = [];
    for (const card of cards) {
      const c = await this.getListedCardByName(card);
      foundCards.push(c);
    }
    return foundCards;
  }

  async createPickedCard(
    card: ListedCard,
    quantity: number,
    picker: DraftPodSeat
  ): Promise<PickedCard> {
    const picked: PickedCard = await this.pickedCardRepository.save({
      listedCard: card,
      quantityPicked: quantity,
      picker: picker,
    });
    return picked;
  }

  async setPickedCards(cards: PickedCardDto[]): Promise<PickedCard[]> {
    let picker: DraftPodSeat;
    for (const picked of cards) {
      const pc = await this.createPickedCard(
        picked.listedCard,
        picked.quantityPicked,
        picked.picker
      );
      picker = picked.picker;
    }
    return await this.getPlayerPickedCards(picker.playerId);
  }

  // staff-only helper function for testing purposes (auto-submit pools for test players)
  async setRandomPickedCards(picker: DraftPodSeat): Promise<PickedCard[]> {
    const RANDOM_CARDS = 45;
    const pickedCards: PickedCard[] = [];
    for (let i = 1; i < RANDOM_CARDS; ++i) {
      const listedCard = await this.listedCardRepository
        .createQueryBuilder("listedCard")
        .select()
        .orderBy("RANDOM()")
        .getOne();
      console.log("random card chosen");
      console.log(listedCard);
      const pc = await this.createPickedCard(listedCard, 1, picker);
      pickedCards.push(pc);
    }
    return pickedCards;
  }

  async playerReturnedCards(playerId: number): Promise<boolean> {
    // get all PickedCards associated with this player
    const cards = await this.getPlayerPickedCards(playerId);
    return await this.removePickedCards(cards);
  }

  async getPlayerPickedCards(playerId: number): Promise<PickedCard[]> {
    const cards: PickedCard[] = await this.pickedCardRepository.find({
      where: {
        picker: {
          id: playerId,
        },
      },
    });
    return cards;
  }

  async removePickedCards(cards: PickedCard[]): Promise<boolean> {
    try {
      for (const card of cards) {
        const cardId = card.id;
        await this.pickedCardRepository
          .createQueryBuilder()
          .delete()
          .from(PickedCard)
          .where("id = :cardId", { cardId })
          .execute();
      }
      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  async getCardDb(): Promise<Card[]> {
    return await this.cardRepository.find();
  }

  // used for the MTGAutoComplete DataListInput
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
