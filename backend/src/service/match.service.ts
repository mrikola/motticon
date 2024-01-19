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
      .leftJoin("match.round", "round")
      .leftJoinAndSelect("match.player1", "player1")
      .leftJoinAndSelect("match.player2", "player2")
      .leftJoinAndSelect("match.resultSubmittedBy", "user")
      .where("round.id = :roundId", { roundId })
      .getMany();
    return matches;
  }

  async getMatchesForRoundByPlayers(
    tournamentId: number,
    roundNumber: number,
    playerIds: number[]
  ) {
    const matches = await this.repository
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.round", "round")
      .where('round."roundNumber" = :roundNumber', { roundNumber })
      .andWhere('round."tournamentId" = :tournamentId', { tournamentId })
      .andWhere((qb) =>
        qb
          .where('match."player1Id" in (:...playerIds)', { playerIds })
          .orWhere('match."player2Id" in (:...playerIds)', { playerIds })
      )
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
        resultSubmittedBy: { id: resultSubmittedBy },
      })
      .where("id = :matchId", { matchId })
      .execute();
  }

  async staffSubmitResult(
    roundId: number,
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
        resultSubmittedBy: { id: resultSubmittedBy },
      })
      .where("id = :matchId", { matchId })
      .execute();
    const matches = this.getMatchesForRound(roundId);
    return matches;
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
