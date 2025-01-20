import { Service, Inject } from "typedi";
import EloRank = require("elo-rank");
import { UserService } from "./user.service";
import { DataSource, Repository } from "typeorm";
import { User } from "../entity/User";

@Service()
export class RatingService {
  private repository: Repository<User>;

  constructor(
    @Inject("DataSource") private appDataSource: DataSource,
    @Inject("UserService") private userService: UserService,
  ) {
    this.repository = this.appDataSource.getRepository(User);
  }

  async setUserRating(rating: number, userId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(User)
      .set({
        rating: rating as number,
      })
      .where("id = :userId", { userId })
      .execute();
  }

  async resetEloForUser(userId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(User)
      .set({
        rating: 1600,
      })
      .where("id = :userId", { userId })
      .execute();
  }

  async updateElo(
    kValue: number,
    player1Id: number,
    player2Id: number,
    winnerId: number,
  ): Promise<void> {
    const elo = new EloRank(kValue);

    const playerA = await this.userService.getUser(player1Id);
    const playerB = await this.userService.getUser(player2Id);
    const playerARating = Number(playerA.rating);
    const playerBRating = Number(playerB.rating);

    const expectedScoreA = elo.getExpected(playerARating, playerBRating);
    const expectedScoreB = elo.getExpected(playerBRating, playerARating);

    let playerANewRating: number;
    let playerBNewRating: number;

    switch (winnerId) {
      case 0: {
        playerANewRating = elo.updateRating(expectedScoreA, 0.5, playerARating);
        playerBNewRating = elo.updateRating(expectedScoreB, 0.5, playerBRating);
        break;
      }
      case playerA.id: {
        playerANewRating = elo.updateRating(expectedScoreA, 1, playerARating);
        playerBNewRating = elo.updateRating(expectedScoreB, 0, playerBRating);
        break;
      }
      case playerB.id: {
        playerANewRating = elo.updateRating(expectedScoreA, 0, playerARating);
        playerBNewRating = elo.updateRating(expectedScoreB, 1, playerBRating);
        break;
      }
      default: {
        return;
      }
    }

    await this.setUserRating(playerANewRating, playerA.id);
    await this.setUserRating(playerBNewRating, playerB.id);
  }
}
