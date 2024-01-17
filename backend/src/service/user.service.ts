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
}
