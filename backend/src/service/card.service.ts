import { AppDataSource } from "../data-source";
import { Service, Inject } from "typedi";
import { DataSource, IsNull, Like, Not, Repository } from "typeorm";
import { Color } from "../dto/card.dto";
import { Card, Token } from "../entity/Card";
import { ListedCard } from "../entity/ListedCard";
import { PickedCard } from "../entity/PickedCard";
import { DraftPodSeat } from "../entity/DraftPodSeat";

type PickedCardDto = {
  listedCard: ListedCard;
  quantityPicked: number;
  picker: DraftPodSeat;
};

@Service()
export class CardService {
  private cardRepository: Repository<Card>;
  private tokenRepository: Repository<Token>;
  private listedCardRepository: Repository<ListedCard>;
  private pickedCardRepository: Repository<PickedCard>;

  constructor(@Inject("DataSource") private appDataSource: DataSource) {
    this.cardRepository = this.appDataSource.getRepository(Card);
    this.tokenRepository = this.appDataSource.getRepository(Token);
    this.listedCardRepository = this.appDataSource.getRepository(ListedCard);
    this.pickedCardRepository = this.appDataSource.getRepository(PickedCard);
  }

  async getCardDb(): Promise<Card[]> {
    return await this.cardRepository.find();
  }

  async getAllTokens(): Promise<Token[]> {
    return await this.tokenRepository.find();
  }

  async updateCardDb(): Promise<Card[]> {
    const cardsArray = require("../no_duplicates_scryfall.json") as Card[];
    console.log("call update card db");
    const tokens = cardsArray.filter((card) => card.type.includes("Token"));
    const tokenObjects: Card[] = [];
    console.log("updating tokens");
    for (const token of tokens) {
      const exists = await this.tokenRepository.exist({
        where: {
          scryfallId: token.scryfallId,
        },
      });
      if (exists) {
        const t = await this.updateToken(token);
        tokenObjects.push(t);
      } else {
        const t = await this.createToken(token);
        tokenObjects.push(t);
      }
    }
    const cards = cardsArray.filter((card) => !card.type.includes("Token"));
    const cardObjects: Card[] = [];
    console.log("updating cards");
    for (const card of cards) {
      const exists = await this.cardRepository.exist({
        where: {
          scryfallId: card.scryfallId,
        },
      });
      if (exists) {
        const c = await this.updateCard(card);
        cardObjects.push(c);
      } else {
        const c = await this.createCard(card);
        cardObjects.push(c);
      }
    }
    return cardObjects.concat(tokenObjects);
  }

  async generateCardDb(): Promise<Card[]> {
    const cardsArray = require("../no_duplicates_scryfall.json") as Card[];
    console.log(cardsArray.length);
    console.log("call generate db");
    // generate tokens first, so they are ready to be associated with the nontoken cards
    const tokens = cardsArray.filter((card) => card.type.includes("Token"));
    const nontokens = cardsArray.filter((card) => !card.type.includes("Token"));
    const generatedTokens = await this.generateTokens(tokens);
    const generatedCards = await this.generateCards(nontokens);
    return generatedTokens.concat(generatedCards);
  }

  async createToken(token: Card): Promise<Card> {
    let colors: Color[] = [];
    if (token.colors) {
      token.colors.forEach((color) => {
        colors.push(color);
      });
    }
    return await this.tokenRepository.save({
      name: token.name,
      set: token.set,
      scryfallId: token.scryfallId,
      cmc: token.cmc ?? undefined,
      colors: colors ?? undefined,
      type: token.type,
      manaCost: token.manaCost,
      oracleText: token.oracleText,
      power: token.power ?? undefined,
      toughness: token.toughness ?? undefined,
      faces: token.faces ?? undefined,
    });
  }

  async updateToken(token: Card): Promise<Card> {
    const existingToken = await this.getCardById(token.scryfallId);
    const id = existingToken.id;
    let colors: Color[] = [];
    if (token.colors) {
      token.colors.forEach((color) => {
        colors.push(color);
      });
    }
    await this.tokenRepository
      .createQueryBuilder()
      .update(Token)
      .set({
        name: token.name,
        set: token.set,
        scryfallId: token.scryfallId,
        cmc: token.cmc ?? undefined,
        colors: colors ?? undefined,
        type: token.type,
        manaCost: token.manaCost,
        oracleText: token.oracleText,
        power: token.power ?? undefined,
        toughness: token.toughness ?? undefined,
        faces: token.faces ?? undefined,
      })
      .where("id = :id", { id })
      .execute();
    return await this.getCardById(token.scryfallId);
  }

  async generateTokens(data: Card[]): Promise<Card[]> {
    const tokens: Card[] = [];
    try {
      data.forEach(async (card) => {
        const exists = await this.tokenRepository.exist({
          where: {
            scryfallId: card.scryfallId,
          },
        });
        if (card.scryfallId && !exists) {
          const dbToken = await this.createToken(card);
          tokens.push(dbToken);
        }
      });
      return tokens;
    } catch {
      return null;
    }
  }

  async createCard(card: Card): Promise<Card> {
    // get each color, use Color-type
    let colors: Color[] = [];
    if (card.colors) {
      card.colors.forEach((color) => {
        colors.push(color);
      });
    }
    // if card has tokens associated with it, add tokens
    const tokens: Card[] = [];
    if (card.tokens) {
      for (const token of card.tokens) {
        const tokenCard: Card = await this.getCardById(token.scryfallId);
        tokens.push(tokenCard);
      }
    }
    return await this.cardRepository.save({
      name: card.name,
      set: card.set,
      scryfallId: card.scryfallId,
      cmc: card.cmc ?? undefined,
      colors: colors ?? undefined,
      type: card.type,
      tokens: tokens,
      manaCost: card.manaCost,
      oracleText: card.oracleText,
      power: card.power ?? undefined,
      toughness: card.toughness ?? undefined,
      faces: card.faces ?? undefined,
    });
  }

  async updateCard(card: Card): Promise<Card> {
    const existingCard = await this.getCardById(card.scryfallId);
    const id = existingCard.id;
    // get each color, use Color-type
    let colors: Color[] = [];
    if (card.colors) {
      card.colors.forEach((color) => {
        colors.push(color);
      });
    }
    // if card has tokens associated with it, add tokens
    const tokens: Card[] = [];
    if (card.tokens) {
      for (const token of card.tokens) {
        const tokenCard: Card = await this.getCardById(token.scryfallId);
        tokens.push(tokenCard);
      }
    }
    await this.cardRepository.save({
      id: id,
      name: card.name,
      set: card.set,
      scryfallId: card.scryfallId,
      cmc: card.cmc ?? undefined,
      colors: colors ?? undefined,
      type: card.type,
      tokens: tokens,
      manaCost: card.manaCost,
      oracleText: card.oracleText,
      power: card.power ?? undefined,
      toughness: card.toughness ?? undefined,
      faces: card.faces ?? undefined,
    });
    return await this.getCardById(card.scryfallId);
  }

  async generateCards(data: Card[]): Promise<Card[]> {
    const cards: Card[] = [];
    try {
      data.forEach(async (card) => {
        const exists = await this.cardRepository.exist({
          where: {
            scryfallId: card.scryfallId,
          },
        });
        if (card.scryfallId && !exists) {
          const dbCard = await this.createCard(card);
          cards.push(dbCard);
        }
      });
      return cards;
    } catch {
      return null;
    }
  }

  async getCardById(scryfallId: string): Promise<Card> {
    return await this.cardRepository
      .createQueryBuilder("card")
      .leftJoinAndSelect("card.tokens", "tokens")
      .where("card.scryfallId = :scryfallId", { scryfallId })
      .getOne();
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

  // by actual id, not scryfall id
  async getListedCardById(id: number): Promise<ListedCard> {
    return await this.listedCardRepository
      .createQueryBuilder("listedCard")
      .leftJoinAndSelect("listedCard.card", "card")
      .where("listedCard.id = :id", { id })
      .getOne();
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

  // Function for cleaning up ListedCard-objects that have no CardList associated with them
  // No orphans should exist if cubes are imported correctly
  async deleteOrphanListedCards(): Promise<ListedCard[]> {
    await this.listedCardRepository
      .createQueryBuilder()
      .delete()
      .from(ListedCard)
      .where("cardlist IS NULL")
      .execute();
    return await this.getAllListedCards();
  }

  async getAllListedCards(): Promise<ListedCard[]> {
    return await this.listedCardRepository
      .createQueryBuilder("listedCard")
      .leftJoinAndSelect("listedCard.cardlist", "cardlist")
      .getMany();
  }

  async getListedCards(cards: string[]): Promise<ListedCard[]> {
    const foundCards: ListedCard[] = [];
    for (const card of cards) {
      const c = await this.getListedCardByName(card);
      foundCards.push(c);
    }
    return foundCards;
  }

  async removeListedCards(cards: ListedCard[]): Promise<boolean> {
    try {
      for (const card of cards) {
        const cardId = card.id;
        await this.listedCardRepository
          .createQueryBuilder()
          .delete()
          .from(ListedCard)
          .where("id = :cardId", { cardId })
          .execute();
      }
      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  async createPickedCard(
    card: ListedCard,
    quantity: number,
    picker: DraftPodSeat,
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
        picked.picker,
      );
      picker = picked.picker;
    }
    return await this.getPlayerPickedCards(picker.id);
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

  async playerReturnedCards(seatId: number): Promise<boolean> {
    // get all PickedCards associated with this draft seat
    const cards = await this.getPlayerPickedCards(seatId);
    return await this.removePickedCards(cards);
  }

  async getAllPickedCards(): Promise<PickedCard[]> {
    return await this.pickedCardRepository.find();
  }

  async getPlayerPickedCards(seatId: number): Promise<PickedCard[]> {
    return await this.pickedCardRepository
      .createQueryBuilder("pickedCard")
      .leftJoinAndSelect("pickedCard.listedCard", "listedCard")
      .leftJoinAndSelect("listedCard.card", "card")
      .leftJoinAndSelect("card.tokens", "tokens")
      .leftJoinAndSelect("pickedCard.picker", "picker")
      .where("picker.id = :seatId", { seatId })
      .getMany();
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

  async removeAllPickedCards(): Promise<boolean> {
    const cards = await this.getAllPickedCards();
    return await this.removePickedCards(cards);
  }

  async searchForCard(query: string): Promise<Card[]> {
    return await this.cardRepository
      .createQueryBuilder()
      .where("LOWER(name) like LOWER(:query)", {
        query: `%${decodeURI(query)}%`,
      })
      .take(20)
      .getMany();
  }
}
