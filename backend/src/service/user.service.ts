import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Tournament } from "../entity/Tournament";
import { partition, uniqBy } from "lodash";
import { UsersTournaments } from "../dto/user.dto";

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
}
