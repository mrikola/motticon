import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Tournament } from "../entity/Tournament";
import { partition, uniqBy } from "lodash";
import { encodePassword } from "../auth/auth";

export class UserService {
  private appDataSource: DataSource;
  private repository: Repository<User>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(User);
  }

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<boolean> {
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

  async getAllUsers(): Promise<User[]> {
    return await this.repository.find();
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.repository.findOne({
      relations: {
        tournamentsStaffed: true,
      },
      where: { email },
    });
  }

  async getTournamentsEnrolled(userId: number): Promise<Tournament[]> {
    const enrollments = await this.appDataSource
      .getRepository(Tournament)
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.enrollments", "enrollment")
      .leftJoinAndSelect("enrollment.player", "user")
      .where("user.id = :userId", { userId })
      .getMany();
    return enrollments;
  }

  async getTournamentsStaffed(userId: number): Promise<Tournament[]> {
    const memberships = await this.appDataSource
      .getRepository(Tournament)
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.staffMembers", "user")
      .where("user.id = :userId", { userId })
      .getMany();

    return memberships;
  }

  async getUsersTournaments(userId: number): Promise<Tournament[]> {
    const enrolled = await this.getTournamentsEnrolled(userId);
    const staffed = await this.getTournamentsStaffed(userId);

    const allTournaments = uniqBy(
      [...enrolled, ...staffed],
      (tournament) => tournament.id
    );
    return allTournaments;
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}
