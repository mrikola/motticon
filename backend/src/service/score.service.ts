import { DataSource, Repository } from "typeorm";
import { PlayerTournamentScore } from "../entity/PlayerTournamentScore";
import { AppDataSource } from "../data-source";
import { ScoreHistory } from "../entity/ScoreHistory";

export class ScoreService {
  private appDataSource: DataSource;
  private repository: Repository<PlayerTournamentScore>;

  constructor() {
    this.appDataSource = AppDataSource;
    this.repository = this.appDataSource.getRepository(PlayerTournamentScore);
  }

  async getPreviousScore(tournamentId: number, playerId: number) {
    return await this.repository.findOne({
      where: {
        tournamentId,
        playerId,
      },
    });
  }

  async awardMatchWin(tournamentId: number, playerId: number) {
    const previousScore = await this.getPreviousScore(tournamentId, playerId);

    await this.repository.upsert(
      {
        tournamentId,
        playerId,
        points: (previousScore?.points ?? 0) + 3,
      },
      ["tournamentId", "playerId"]
    );
  }

  async awardDraw(tournamentId: number, player1Id: number, player2Id: number) {
    const previousScore1 = await this.getPreviousScore(tournamentId, player1Id);
    const previousScore2 = await this.getPreviousScore(tournamentId, player2Id);

    await this.repository.upsert(
      {
        tournamentId,
        playerId: player1Id,
        points: (previousScore1?.points ?? 0) + 1,
      },
      ["tournamentId", "playerId"]
    );

    await this.repository.upsert(
      {
        tournamentId,
        playerId: player2Id,
        points: (previousScore2?.points ?? 0) + 1,
      },
      ["tournamentId", "playerId"]
    );
  }

  async awardDraftWin(tournamentId: number, playerId: number) {
    const previousScore = await this.getPreviousScore(tournamentId, playerId);

    await this.repository.upsert(
      {
        tournamentId,
        playerId,
        draftsWon: (previousScore.draftsWon ?? 0) + 1,
      },
      ["tournamentId", "playerId"]
    );
  }

  async saveSnapshot(tournamentId: number, roundNumber: number) {
    const scores = await this.repository.find({ where: { tournamentId } });
    this.appDataSource
      .getRepository(ScoreHistory)
      .insert(
        scores.map((score) => ({ ...score, roundNumber } as ScoreHistory))
      );
  }
}
