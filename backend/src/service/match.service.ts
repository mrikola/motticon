import { Brackets, DataSource, Repository } from "typeorm";
import { Match } from "../entity/Match";
import { AppDataSource } from "../data-source";
import { LRUCache } from "lru-cache";

export class MatchService {
  private appDataSource: DataSource;
  private repository: Repository<Match>;
  private roundMatchesCache: LRUCache<number, Match[]>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(Match);
    this.roundMatchesCache = new LRUCache({
      ttl: 1000 * 10,
      ttlAutopurge: true,
    });
  }

  async getMatch(matchId: number): Promise<Match> {
    return await this.repository
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.resultSubmittedBy", "resultSubmittedUser")
      .leftJoinAndSelect("match.player1", "player1")
      .leftJoinAndSelect("match.player2", "player2")
      .leftJoinAndSelect("match.playerGoingFirst", "playerGoingFirst")
      .where("match.id = :matchId", { matchId })
      .getOne();
  }

  async getMatchesForRound(roundId: number) {
    const cachedMatches = this.roundMatchesCache.get(roundId);
    if (cachedMatches) {
      console.log("cache hit");
      return cachedMatches;
    }
    const matches = await this.repository
      .createQueryBuilder("match")
      .leftJoin("match.round", "round")
      .leftJoinAndSelect("match.player1", "player1")
      .leftJoinAndSelect("match.player2", "player2")
      .leftJoinAndSelect("match.resultSubmittedBy", "user")
      .leftJoinAndSelect("match.playerGoingFirst", "playerGoingFirst")
      .where("round.id = :roundId", { roundId })
      .getMany();
    this.roundMatchesCache.set(roundId, matches);
    return matches;
  }

  async getMatchesForRoundByPlayers(roundId: number, playerIds: number[]) {
    const matches = await this.repository
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.round", "round")
      .leftJoinAndSelect("match.player1", "player1")
      .leftJoinAndSelect("match.player2", "player2")
      .where("round.id = :roundId", { roundId })
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('match."player1Id" in (:...playerIds)', { playerIds })
            .orWhere('match."player2Id" in (:...playerIds)', { playerIds })
        )
      )
      .getMany();
    return matches;
  }

  async submitResult(
    matchId: number,
    resultSubmittedBy: number,
    player1GamesWon: number,
    player2GamesWon: number
  ): Promise<Match> {
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
    return await this.getMatch(matchId);
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
    // invalidate the round cache so that staff view looks correct
    this.roundMatchesCache.delete(roundId);
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
