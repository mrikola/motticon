import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Cube } from "../entity/Cube";
import { CardList } from "../entity/CardList";
import { ListedCard } from "../entity/ListedCard";
import { CubeCardDto } from "../dto/card.dto";
import { CardService } from "./card.service";
import { Card } from "../entity/Card";

export class CubeService {
  private appDataSource: DataSource;
  private repository: Repository<Cube>;
  private cardService: CardService;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Cube);
    this.cardService = new CardService();
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
    cards: CubeCardDto[]
  ): Promise<Cube> {
    // TODO improve return values
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
        listedCards
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
    imageUrl: string
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
    return await this.getCube(cubeId);
  }

  async cardsToListedCards(cards: CubeCardDto[]): Promise<ListedCard[]> {
    const listedCards: ListedCard[] = [];
    await Promise.all(
      cards.map(async (card) => {
        const cardObj: Card = await this.cardService.getCardById(
          card.scryfallId
        );
        const listedCard = await this.appDataSource
          .getRepository(ListedCard)
          .create({
            card: cardObj,
            quantityInCube: card.quantity,
          });
        listedCards.push(listedCard);
      })
    );
    return listedCards;
  }

  async createCardList(
    cubeId: number,
    cube: Cube,
    cards: ListedCard[]
  ): Promise<CardList> {
    const cardlist: CardList = await this.appDataSource
      .getRepository(CardList)
      .save({
        cubeId,
        cube,
        cards: cards,
      });
    return cardlist;
  }
}
