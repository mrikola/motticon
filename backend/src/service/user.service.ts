import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export class UserService {
  private appDataSource: DataSource;
  private repository: Repository<User>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(User);
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.repository.findOne({
      where: { email: email },
    });
  }
}
