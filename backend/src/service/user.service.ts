import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Tournament } from "../entity/Tournament";
import { partition, uniqBy } from "lodash";
import { UsersTournaments } from "../dto/user.dto";
import { Enrollment } from "../entity/Enrollment";
import { Preference } from "../entity/Preference";

export class UserService {
  private appDataSource: DataSource;
  private repository: Repository<User>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(User);
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

  async getUsersTournaments(userId: number): Promise<UsersTournaments> {
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

  async getUserTournamentInfo(
    userId: number,
    tournamentId: number
  ): Promise<any> {
    // get tournament basics
    const tournament = await this.appDataSource
      .getRepository(Tournament)
      .findOne({ where: { id: tournamentId } });

    // get enrollment
    const enrollment = await this.appDataSource
      .getRepository(Enrollment)
      .createQueryBuilder("enrollment")
      .leftJoinAndSelect("enrollment.player", "user")
      .where("user.id = :userId and enrollment.tournamentId = :tournamentId", {
        userId,
        tournamentId,
      })
      .getOne();

    // get preferences
    const preferences = await this.appDataSource
      .getRepository(Preference)
      .createQueryBuilder("preference")
      .where(
        'preference."playerId" = :userId and preference."tournamentId" = :tournamentId',
        { userId, tournamentId }
      )
      .getMany();
    return { tournament, enrollment, preferences };
  }
}
