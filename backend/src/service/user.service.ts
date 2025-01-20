import { Service, Inject } from "typedi";
import { DataSource, Repository } from "typeorm";
import { User } from "../entity/User";
import { PreferenceService } from "./preference.service";
import { encodePassword } from "../auth/auth";
import { Tournament } from "../entity/Tournament";
import { uniqBy } from "lodash";
import { UserCubePreferenceDto } from "../dto/user.dto";

@Service("UserService")
export class UserService {
  private repository: Repository<User>;

  constructor(
    @Inject("DataSource") private appDataSource: DataSource,
    @Inject("PreferenceService") private preferenceService: PreferenceService,
  ) {
    this.repository = this.appDataSource.getRepository(User);
  }

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isDummy: boolean = false,
  ): Promise<boolean> {
    // TODO improve return values
    try {
      await this.repository.insert({
        firstName,
        lastName,
        email,
        password: encodePassword(password),
        isAdmin: false,
        isDummy,
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      // todo: make sure this actually works and doesn't break stuff horribly
      this.appDataSource
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("id = :userId", { userId })
        .execute();
      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  public async getUser(id: number): Promise<User> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  public async getAllUsers(): Promise<User[]> {
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

  public async getTournamentsStaffed(userId: number): Promise<Tournament[]> {
    const memberships = await this.appDataSource
      .getRepository(Tournament)
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.staffMembers", "user")
      .where("user.id = :userId", { userId })
      .getMany();

    return memberships;
  }

  public async getUsersTournaments(userId: number): Promise<Tournament[]> {
    const enrolled = await this.getTournamentsEnrolled(userId);
    const staffed = await this.getTournamentsStaffed(userId);

    const allTournaments = uniqBy(
      [...enrolled, ...staffed],
      (tournament) => tournament.id,
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

  public async setCubePreferences(
    preferences: UserCubePreferenceDto[],
  ): Promise<boolean> {
    let success = false;
    // delete all old preferences
    // todo: this shouldn't be needed to run more than 1x (but delete is now being run for each preference)
    await Promise.all(
      preferences.map(async (preference) => {
        success = await this.deleteCubePreferences(preference);
      }),
    );
    // add new preferences
    await Promise.all(
      preferences.map(async (preference) => {
        success = await this.preferenceService.setPreference(
          preference.tournamentId,
          preference.playerId,
          preference.cubeId,
          preference.points,
        );
      }),
    );
    return success;
  }

  public async deleteCubePreferences(
    preferences: UserCubePreferenceDto,
  ): Promise<boolean> {
    let success = false;
    // deletes all preferences assigned to tournamentId & playerId
    success = await this.preferenceService.deletePreference(
      preferences.tournamentId,
      preferences.playerId,
    );
    return success;
  }
}
