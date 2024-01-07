import { DataSource, Repository } from "typeorm";
import { Match } from "../entity/Match";
import { AppDataSource } from "../data-source";

export class MatchService {
  private appDataSource: DataSource;
  private repository: Repository<Match>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Match);
  }

  async getMatchesForRound(roundId: number) {
    const matches = await this.repository
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.round", "round")
      .where("round.id = :roundId", { roundId })
      .getMany();
    return matches;
  }

  async submitResult(
    matchId: number,
    resultSubmittedBy: number,
    player1GamesWon: number,
    player2GamesWon: number
  ) {
    await this.repository
      .createQueryBuilder("match")
      .update(Match)
      .set({
        player1GamesWon,
        player2GamesWon,
        resultSubmittedById: resultSubmittedBy,
      })
      .where("id = :matchId", { matchId })
      .execute();
  }

  async getPlayerMatchHistory(userId, tournamentId) {
    return await this.repository
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.round", "round")
      .leftJoinAndSelect("round.tournament", "tournament")
      .where("tournament.id = :tournamentId", { tournamentId })
      .andWhere("(match.player1Id = :userId OR match.player2Id = :userId)", {
        userId,
      })
      .orderBy("round.roundNumber")
      .getMany();
  }
}
