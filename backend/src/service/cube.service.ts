import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Cube } from "../entity/Cube";
import { CardList } from "../entity/CardList";
import { ListedCard } from "../entity/ListedCard";
import { CubeCardDto } from "../dto/card.dto";

export class CubeService {
  private appDataSource: DataSource;
  private repository: Repository<Cube>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Cube);
  }

  async getAllCubes(): Promise<Cube[]> {
    return await this.repository.find();
  }

  async getCube(id: number): Promise<Cube> {
    return await this.repository.findOne({
      where: { id },
    });
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
      console.log(cube);
      // const cube: Cube = this.repository.create({
      //   title,
      //   description,
      //   url,
      //   owner,
      //   imageUrl,
      // });

      // transform list of cards to ListedCard-objects
      const listedCards: ListedCard[] = await this.cardsToListedCards(cards);
      // create CardList object from ListedCard[]
      const cardlist: CardList = await this.createCardList(
        cube.id,
        cube,
        listedCards
      );
      await this.repository
        .createQueryBuilder("cube")
        .update()
        .set({ cardlist: cardlist })
        .where({ id: cube.id })
        .execute();
      return this.getCube(cube.id);
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
    console.log("called cardsToListedCards");
    const listedCards: ListedCard[] = [];
    cards.forEach(async (card) => {
      const listedCard = this.appDataSource.getRepository(ListedCard).create({
        card: card,
        quantityInCube: card.quantity,
      });
      listedCards.push(listedCard);
    });
    return listedCards;
  }

  async createCardList(
    cubeId: number,
    cube: Cube,
    cards: ListedCard[]
  ): Promise<CardList> {
    console.log(
      "called createCardList with: id: " +
        cubeId +
        ", cube: " +
        cube +
        ", cards: " +
        cards
    );
    const cardlist: CardList = await this.appDataSource
      .getRepository(CardList)
      .save({
        cubeId,
        cube,
        cards,
      });
    console.log("cardlist:");
    console.log(cardlist);
    return cardlist;
  }
}
