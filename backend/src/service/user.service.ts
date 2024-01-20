import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Tournament } from "../entity/Tournament";
import { partition, uniqBy } from "lodash";
import {
  PlayerTournamentInfo,
  TournamentsByType,
} from "../dto/tournaments.dto";
import { TournamentService } from "./tournament.service";
import { Match } from "../entity/Match";
import { encodePassword } from "../auth/auth";
import EloRank = require("elo-rank");

export class UserService {
  private appDataSource: DataSource;
  private repository: Repository<User>;
  private tournamentService: TournamentService;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(User);
    this.tournamentService = new TournamentService();
  }

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    // TODO improve return values
    try {
      await this.repository.insert({
        firstName,
        lastName,
        email,
        password: encodePassword(password),
        isAdmin: false,
      });
      return true;
    } catch {
      return false;
    }
  }

  async getUser(id: number): Promise<User> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.repository.findOne({
      relations: {
        tournamentsStaffed: true,
      },
      where: { email },
    });
  }

  async getTournamentsEnrolled(userId: number) {
    const enrollments = await this.appDataSource
      .getRepository(Tournament)
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.enrollments", "enrollment")
      .leftJoinAndSelect("enrollment.player", "user")
      .where("user.id = :userId", { userId })
      .getMany();
    return enrollments;
  }

  async getTournamentsStaffed(userId: number) {
    const memberships = await this.appDataSource
      .getRepository(Tournament)
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.staffMembers", "user")
      .where("user.id = :userId", { userId })
      .getMany();

    return memberships;
  }

  async getUsersTournaments(userId: number): Promise<TournamentsByType> {
    const enrolled = await this.getTournamentsEnrolled(userId);
    const staffed = await this.getTournamentsStaffed(userId);

    const allTournaments = uniqBy(
      [...enrolled, ...staffed],
      (tournament) => tournament.id
    );

    const today = new Date();
    const [past, notPast] = partition(
      allTournaments,
      (tournament) => tournament.endDate < today
    );
    const [future, ongoing] = partition(
      notPast,
      (tournament) => tournament.startDate > today
    );

    return {
      past,
      ongoing,
      future,
    };
  }

  async getCurrentDraftAndMatch(
    userId: number,
    tournamentId: number
  ): Promise<any> {
    const round = await this.tournamentService.getCurrentRound(tournamentId);
    const draft = await this.tournamentService.getCurrentDraft(tournamentId);

    // TODO get seat info

    const match = await this.appDataSource
      .getRepository(Match)
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.round", "round")
      .leftJoinAndSelect("match.resultSubmittedBy", "resultSubmittedUser")
      .leftJoinAndSelect("match.player1", "player1")
      .leftJoinAndSelect("match.player2", "player2")
      .where("round.id = :roundId", { roundId: round.id })
      .andWhere((qb) =>
        qb
          .where('match."player1Id" = :userId', { userId })
          .orWhere('match."player2Id" = :userId', { userId })
      )
      .getOne();

    return { round, draft, match };
  }

  async setUserRating(rating: number, userId: number) {
    const user = await this.repository
      .createQueryBuilder()
      .update(User)
      .set({
        rating: rating as number,
      })
      .where("id = :userId", { userId })
      .execute();
  }

  async resetEloForUser(userId: number) {
    const user = await this.repository
      .createQueryBuilder()
      .update(User)
      .set({
        rating: 1600,
      })
      .where("id = :userId", { userId })
      .execute();
    return user;
  }

  async updateElo(
    kValue: number,
    player1Id: number,
    player2Id: number,
    winnerNumber: number
  ) {
    // todo: change this to get a whole array of players to change ratings for

    // create object with K-Factor (without it defaults to 32)
    const elo = new EloRank(kValue);

    const playerA = await this.getUser(player1Id);
    const playerB = await this.getUser(player2Id);
    const playerARating = Number(playerA.rating);
    const playerBRating = Number(playerB.rating);

    // Gets expected score for first parameter
    const expectedScoreA = elo.getExpected(playerARating, playerBRating);
    const expectedScoreB = elo.getExpected(playerBRating, playerARating);

    // placeholders before these get defined
    var playerANewRating: number;
    var playerBNewRating: number;
    // update score, 1 if won 0 if lost
    if (winnerNumber === 1) {
      playerANewRating = elo.updateRating(expectedScoreA, 1, playerARating);
      playerBNewRating = elo.updateRating(expectedScoreB, 0, playerBRating);
    } else {
      playerANewRating = elo.updateRating(expectedScoreA, 0, playerARating);
      playerBNewRating = elo.updateRating(expectedScoreB, 1, playerBRating);
    }

    this.setUserRating(playerANewRating, playerA.id);
    this.setUserRating(playerBNewRating, playerB.id);
  }
}
