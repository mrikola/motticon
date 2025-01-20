import { Service, Inject } from "typedi";
import { DataSource, Repository } from "typeorm";
import { Cube } from "../entity/Cube";
import { CardList } from "../entity/CardList";
import { ListedCard } from "../entity/ListedCard";
import { CubeCardDto } from "../dto/card.dto";
import { CardService } from "./card.service";
import { Card } from "../entity/Card";
import { CubeDiffDto } from "../dto/cube.dto";

@Service()
export class CubeService {
  private repository: Repository<Cube>;

  constructor(
    @Inject("DataSource") private appDataSource: DataSource,
    @Inject("CardService") private cardService: CardService,
  ) {
    this.repository = this.appDataSource.getRepository(Cube);
  }

  async getAllCubes(): Promise<Cube[]> {
    return await this.repository.find();
  }

  async getCube(id: number): Promise<Cube> {
    return await this.repository
      .createQueryBuilder("cube")
      .leftJoinAndSelect("cube.cardlist", "cardlist")
      .leftJoinAndSelect("cardlist.cards", "listedcards")
      .leftJoinAndSelect("listedcards.card", "card")
      .leftJoinAndSelect("card.tokens", "tokens")
      .where("cube.id = :id", { id })
      .getOne();
  }

  async getCubesForTournament(tournamentId: number): Promise<Cube[]> {
    return await this.repository
      .createQueryBuilder("cube")
      .leftJoin("cube.tournaments", "tournament")
      .where("tournament.id = :tournamentId", { tournamentId })
      .getMany();
  }

  async addCube(
    title: string,
    description: string,
    url: string,
    owner: string,
    imageUrl: string,
    cards: CubeCardDto[],
  ): Promise<Cube> {
    try {
      const cube: Cube = await this.repository.save({
        title,
        description,
        url,
        owner,
        imageUrl,
      });
      // transform list of cards to ListedCard-objects
      const listedCards: ListedCard[] = await this.cardsToListedCards(cards);
      // create CardList object from ListedCard[]
      const cardlist: CardList = await this.createCardList(
        cube.id,
        cube,
        listedCards,
      );

      await this.appDataSource
        .getRepository(ListedCard)
        .save(listedCards.map((lc) => ({ ...lc, cardlist })));
      // update the created cube with the cardlist
      await this.repository
        .createQueryBuilder()
        .update(Cube)
        .set({ cardlist: cardlist })
        .where({ id: cube.id })
        .execute();
      return await this.getCube(cube.id);
    } catch {
      return null;
    }
  }

  async editCube(
    cubeId: number,
    title: string,
    description: string,
    url: string,
    owner: string,
    imageUrl: string,
    cards: CubeCardDto[],
  ): Promise<Cube> {
    await this.repository
      .createQueryBuilder("cube")
      .update(Cube)
      .set({
        title,
        description,
        url,
        owner,
        imageUrl,
      })
      .where("id = :cubeId", { cubeId })
      .execute();
    // run update function to make sure cardlist is up-to-date
    await this.updateCubeCards(cubeId, cards);
    return await this.getCube(cubeId);
  }

  async getCardlist(id: number): Promise<CardList> {
    return await this.appDataSource
      .getRepository(CardList)
      .createQueryBuilder("cardlist")
      .leftJoinAndSelect("cardlist.cards", "listedcards")
      .where("cardlist.id = :id", { id })
      .getOne();
  }

  async updateCubeCards(
    cubeId: number,
    cardsToAdd: CubeCardDto[],
  ): Promise<Cube> {
    const cube = await this.getCube(cubeId);
    const diff: CubeDiffDto = await this.getCubeDiff(cubeId, cardsToAdd);
    // remove the orphaned ListedCard objects
    await this.cardService.removeListedCards(diff.orphanedCards);
    // create ListedCard objects for the new cards
    const newListedCards: ListedCard[] = await this.cardsToListedCards(
      diff.newCards,
    );
    // update the generated ListedCard-objects with the CardList-object
    const cardList = cube.cardlist;
    await this.assignCardListToListedCards(newListedCards, cardList);
    return await this.getCube(cubeId);
  }

  // function get the diff between a cube's current cardlist, and a list of given cards
  // returns a dto with new and orphaned cards as separate objects
  async getCubeDiff(
    cubeId: number,
    cardsToAdd: CubeCardDto[],
  ): Promise<CubeDiffDto> {
    const cube = await this.getCube(cubeId);
    const existingCards: ListedCard[] = cube.cardlist.cards;
    const existingCardIds = [];
    for (const card of existingCards) {
      existingCardIds.push(card.card.scryfallId);
    }
    const newCardIds: string[] = [];
    for (const card of cardsToAdd) {
      newCardIds.push(card.scryfallId);
    }
    // cards that were part of the cube before, but now no longer are
    const orphanCards: ListedCard[] = existingCards.filter(
      (c) => !newCardIds.includes(c.card.scryfallId),
    );
    // new cards that were not in the cube previously
    const newCards = cardsToAdd.filter(
      (c) => !existingCardIds.includes(c.scryfallId),
    );
    const diff: CubeDiffDto = {
      orphanedCards: orphanCards,
      newCards: newCards,
    };
    return diff;
  }

  async cardsToListedCards(cards: CubeCardDto[]): Promise<ListedCard[]> {
    const listedCards: ListedCard[] = [];
    await Promise.all(
      cards.map(async (card) => {
        const cardObj: Card = await this.cardService.getCardById(
          card.scryfallId,
        );
        const listedCard = await this.appDataSource
          .getRepository(ListedCard)
          .save({
            card: cardObj,
            quantityInCube: card.quantity,
          });
        listedCards.push(listedCard);
      }),
    );
    return listedCards;
  }

  async assignCardListToListedCards(
    cards: ListedCard[],
    cardlist: CardList,
  ): Promise<ListedCard[]> {
    const listedCards: ListedCard[] = [];
    for (const lc of cards) {
      const id = lc.id;
      await this.appDataSource
        .getRepository(ListedCard)
        .createQueryBuilder()
        .update(ListedCard)
        .set({ cardlist: cardlist })
        .where({ id: id })
        .execute();
      const listedCard: ListedCard = await this.cardService.getListedCardById(
        lc.id,
      );
      listedCards.push(listedCard);
    }
    return listedCards;
  }

  async createCardList(
    cubeId: number,
    cube: Cube,
    listedCards: ListedCard[],
  ): Promise<CardList> {
    const cardlist: CardList = await this.appDataSource
      .getRepository(CardList)
      .save({
        cubeId,
        cube,
        cards: listedCards,
      });
    return cardlist;
  }
}
