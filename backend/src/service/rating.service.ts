import EloRank = require("elo-rank");
import { UserService } from "./user.service";
import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export class RatingService {
  private appDataSource: DataSource;
  private userService = new UserService();

  constructor() {
    this.appDataSource = AppDataSource;
    this.userService = new UserService();
  }

  // TODO return the user?
  async setUserRating(rating: number, userId: number): Promise<void> {
    const user = await this.appDataSource
      .getRepository(User)
      .createQueryBuilder()
      .update(User)
      .set({
        rating: rating as number,
      })
      .where("id = :userId", { userId })
      .execute();
  }

  // TODO return the user?
  async resetEloForUser(userId: number): Promise<void> {
    const user = await this.appDataSource
      .getRepository(User)
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
    winnerId: number
  ): Promise<void> {
    // todo: change this to get a whole array of players to change ratings for

    // create object with K-Factor (without it defaults to 32)
    const elo = new EloRank(kValue);

    const playerA = await this.userService.getUser(player1Id);
    const playerB = await this.userService.getUser(player2Id);
    const playerARating = Number(playerA.rating);
    const playerBRating = Number(playerB.rating);

    // Gets expected score for first parameter
    const expectedScoreA = elo.getExpected(playerARating, playerBRating);
    const expectedScoreB = elo.getExpected(playerBRating, playerARating);

    // placeholders before these get defined
    var playerANewRating: number;
    var playerBNewRating: number;

    console.log(
      "called update elo for: " +
        playerA.firstName +
        " " +
        playerA.lastName +
        " and " +
        playerB.firstName +
        " " +
        playerB.lastName +
        ". winner: " +
        winnerId
    );

    switch (winnerId) {
      case 0: {
        // draw
        playerANewRating = elo.updateRating(expectedScoreA, 0.5, playerARating);
        playerBNewRating = elo.updateRating(expectedScoreB, 0.5, playerBRating);
        break;
      }
      case playerA.id: {
        // A wins
        playerANewRating = elo.updateRating(expectedScoreA, 1, playerARating);
        playerBNewRating = elo.updateRating(expectedScoreB, 0, playerBRating);
        break;
      }
      case playerB.id: {
        // B wins
        playerANewRating = elo.updateRating(expectedScoreA, 0, playerARating);
        playerBNewRating = elo.updateRating(expectedScoreB, 1, playerBRating);
        break;
      }
      default: {
        // error
        return;
      }
    }

    this.setUserRating(playerANewRating, playerA.id);
    this.setUserRating(playerBNewRating, playerB.id);
  }
}
