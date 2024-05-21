import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { DraftPodSeat } from "../entity/DraftPodSeat";
import { ListedCard } from "../entity/ListedCard";
import { PickedCard } from "../entity/PickedCard";

type PickedCardDto = {
  listedCard: ListedCard;
  quantityPicked: number;
  picker: DraftPodSeat;
};

export class PickedCardService {
  private appDataSource: DataSource;
  private repository: Repository<PickedCard>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(PickedCard);
  }

  async createPickedCard(
    card: ListedCard,
    quantity: number,
    picker: DraftPodSeat
  ): Promise<PickedCard> {
    const picked: PickedCard = await this.repository.save({
      listedCard: card,
      quantityPicked: quantity,
      picker: picker,
    });
    return picked;
  }

  async setPickedCards(cards: PickedCardDto[]): Promise<PickedCard[]> {
    const pickedCards: PickedCard[] = [];
    for (const picked of cards) {
      const pc = await this.createPickedCard(
        picked.listedCard,
        picked.quantityPicked,
        picked.picker
      );
      pickedCards.push(pc);
    }
    return pickedCards;
  }
}
