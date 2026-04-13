import { Service, Inject } from "typedi";
import { DataSource, Repository } from "typeorm";
import { PlayerTournamentScore } from "../entity/PlayerTournamentScore";
import { ScoreHistory } from "../entity/ScoreHistory";
import { PlayerPodScore } from "../entity/PlayerPodScore";
import { PlayerPodScoreHistory } from "../entity/PlayerPodScoreHistory";
import { OMWView } from "../entity/OMWView";
import { RecordByPlayer, StandingsRow } from "../dto/score.dto";
import { UserService } from "./user.service";
import { MatchService } from "./match.service";
import { sumArray } from "../util/array";
import { DraftPod } from "../entity/DraftPod";
import { Round } from "../entity/Round";
import { Match } from "../entity/Match";

@Service()
export class ScoreService {
  private repository: Repository<PlayerTournamentScore>;

  constructor(
    @Inject("DataSource") private appDataSource: DataSource,
    @Inject("UserService") private userService: UserService,
    @Inject("MatchService") private matchService: MatchService,
  ) {
    this.repository = this.appDataSource.getRepository(PlayerTournamentScore);
  }

  async getPreviousScore(
    tournamentId: number,
    playerId: number,
  ): Promise<PlayerTournamentScore> {
    return await this.repository.findOne({
      where: {
        tournamentId,
        playerId,
      },
    });
  }

  async getStandings(
    tournamentId: number,
    roundNumber: number,
  ): Promise<StandingsRow[]> {
    const matches = await this.appDataSource
      .getRepository(OMWView)
      .createQueryBuilder("omw")
      .where("omw.tournamentId = :tournamentId", { tournamentId })
      .andWhere("omw.roundNumber <= :roundNumber", { roundNumber })
      .orderBy("omw.roundNumber")
      .getMany();

    const tournamentScores = await this.appDataSource
      .getRepository(ScoreHistory)
      .createQueryBuilder("sh")
      .leftJoinAndSelect("sh.player", "player")
      .where("sh.tournamentId = :tournamentId", { tournamentId })
      .andWhere("sh.roundNumber = :roundNumber", { roundNumber })
      .getMany();

    const records: RecordByPlayer = new Map();
    for (let row of matches) {
      const previousRecord = records.get(row.playerId);
      const opponentIsBye = (await this.userService.getUser(row.opponentId))
        .isDummy;
      // TODO when dropping is linked to round number, check against that
      // || (await this.enrollmentService.getEnrollment(row.opponentId,tournamentId)).dropped

      records.set(row.playerId, {
        ...previousRecord,
        id: row.playerId,
        gamesWon: (previousRecord?.gamesWon ?? 0) + row.playerGamesWon,
        gamesPlayed: (previousRecord?.gamesPlayed ?? 0) + row.gamesPlayed,
        matchPoints: (previousRecord?.matchPoints ?? 0) + row.playerPoints,
        matchesPlayed: (previousRecord?.matchesPlayed ?? 0) + 1,
        opponentIds: (previousRecord?.opponentIds ?? []).concat(
          opponentIsBye ? [] : row.opponentId,
        ),
      });

      const currentRecord = records.get(row.playerId);
      records.set(row.playerId, {
        ...currentRecord,
        matchPointPercentage: Math.max(
          1 / 3,
          currentRecord.matchPoints /
            (Math.max(currentRecord.matchesPlayed, 1) * 3),
        ),
      });
    }

    const standings: StandingsRow[] = [];

    records.forEach((player) => {
      const scoreRow = tournamentScores.find(
        (score) => score.playerId === player.id,
      );

      const omw =
        sumArray(
          player.opponentIds.map((id) => records.get(id).matchPointPercentage),
        ) / Math.max(player.opponentIds.length, 1);

      const pgw =
        player.gamesPlayed > 0 ? player.gamesWon / player.gamesPlayed : 0;

      standings.push({
        playerId: scoreRow.player.id,
        firstName: scoreRow.player.firstName,
        lastName: scoreRow.player.lastName,
        matchPoints: player.matchPoints,
        draftsWon: scoreRow.draftsWon,
        opponentMatchWinPercentage: omw,
        playedGamesWinPercentage: pgw,
      });
    });

    return standings.sort((a, b) => {
      if (a.matchPoints === b.matchPoints) {
        if (a.draftsWon === b.draftsWon) {
          if (
            Math.round(a.opponentMatchWinPercentage * 1000) ===
            Math.round(b.opponentMatchWinPercentage * 1000)
          ) {
            return b.playedGamesWinPercentage - a.playedGamesWinPercentage;
          }
          return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
        }
        return b.draftsWon - a.draftsWon;
      }
      return b.matchPoints - a.matchPoints;
    });
  }

  async awardMatchWin(tournamentId: number, playerId: number): Promise<void> {
    const previousScore = await this.getPreviousScore(tournamentId, playerId);

    await this.repository.upsert(
      {
        tournamentId,
        playerId,
        points: (previousScore?.points ?? 0) + 3,
      },
      ["tournamentId", "playerId"],
    );
  }

  async awardDraw(
    tournamentId: number,
    player1Id: number,
    player2Id: number,
  ): Promise<void> {
    const previousScore1 = await this.getPreviousScore(tournamentId, player1Id);
    const previousScore2 = await this.getPreviousScore(tournamentId, player2Id);

    await this.repository.upsert(
      {
        tournamentId,
        playerId: player1Id,
        points: (previousScore1?.points ?? 0) + 1,
      },
      ["tournamentId", "playerId"],
    );

    await this.repository.upsert(
      {
        tournamentId,
        playerId: player2Id,
        points: (previousScore2?.points ?? 0) + 1,
      },
      ["tournamentId", "playerId"],
    );
  }

  async awardDraftWin(tournamentId: number, playerId: number): Promise<void> {
    const previousScore = await this.getPreviousScore(tournamentId, playerId);

    await this.repository.upsert(
      {
        tournamentId,
        playerId,
        draftsWon: (previousScore.draftsWon ?? 0) + 1,
      },
      ["tournamentId", "playerId"],
    );
  }

  async saveSnapshot(tournamentId: number, roundNumber: number): Promise<void> {
    const scores = await this.repository.find({ where: { tournamentId } });
    this.appDataSource
      .getRepository(ScoreHistory)
      .insert(
        scores.map((score) => ({ ...score, roundNumber }) as ScoreHistory),
      );
  }

  /**
   * Calculate and update pod standings for a specific pod after a round completes
   */
  async updatePodStandings(podId: number, roundId: number): Promise<void> {
    // Get the pod with seats
    const pod = await this.appDataSource.getRepository(DraftPod).findOne({
      where: { id: podId },
      relations: ["seats", "seats.player", "draft"],
    });

    if (!pod || !pod.draft) {
      console.warn(`Pod ${podId} not found or missing draft relation`);
      return;
    }

    const round = await this.appDataSource.getRepository(Round).findOne({
      where: { id: roundId },
      select: ["id", "roundNumber", "status", "tournamentId", "startTime"],
    });

    if (!round) {
      console.warn(`Round ${roundId} not found`);
      return;
    }

    const playerIds = pod.seats.map((seat) => seat.player.id);

    // Get all completed rounds in this draft up to and including current round
    // We explicitly include the current round by ID to ensure it's included
    // even if there's a timing issue with the status update
    const previousRounds = await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .where('round."tournamentId" = :tournamentId', {
        tournamentId: round.tournamentId,
      })
      .andWhere('round."roundNumber" >= :firstRound', {
        firstRound: pod.draft.firstRound,
      })
      .andWhere('round."roundNumber" <= :currentRound', {
        currentRound: round.roundNumber,
      })
      .andWhere("(round.status = :status OR round.id = :currentRoundId)", {
        status: "completed",
        currentRoundId: round.id,
      })
      .orderBy('round."roundNumber"', "ASC")
      .getMany();

    // Ensure the current round is included even if status hasn't updated yet
    let previousRoundsList = previousRounds;
    const currentRoundInList = previousRoundsList.some(
      (r) => r.id === round.id,
    );
    if (!currentRoundInList) {
      previousRoundsList = [...previousRoundsList, round];
    }

    // Initialize standings map
    const standingsMap = new Map<
      number,
      {
        matchPoints: number;
        gamesWon: number;
        gamesPlayed: number;
        opponents: number[];
      }
    >();

    playerIds.forEach((playerId) => {
      standingsMap.set(playerId, {
        matchPoints: 0,
        gamesWon: 0,
        gamesPlayed: 0,
        opponents: [],
      });
    });

    // Process all matches in previous rounds
    for (const prevRound of previousRoundsList) {
      const matches = await this.matchService.getMatchesForRoundByPlayers(
        prevRound.id,
        playerIds,
      );

      // Only count matches where both players are in this pod
      // Check both pod relation and podId field for robustness
      const podMatches = matches.filter(
        (match) =>
          (match.pod?.id === podId || match.podId === podId) &&
          playerIds.includes(match.player1.id) &&
          playerIds.includes(match.player2.id),
      );

      for (const match of podMatches) {
        const p1Id = match.player1.id;
        const p2Id = match.player2.id;
        const p1Standing = standingsMap.get(p1Id);
        const p2Standing = standingsMap.get(p2Id);

        if (!p1Standing || !p2Standing) continue;

        // Calculate points (3 for win, 1 for draw, 0 for loss)
        let p1Points = 0;
        let p2Points = 0;

        if (match.player1GamesWon > match.player2GamesWon) {
          p1Points = 3;
          p2Points = 0;
        } else if (match.player1GamesWon < match.player2GamesWon) {
          p1Points = 0;
          p2Points = 3;
        } else {
          p1Points = 1;
          p2Points = 1;
        }

        // Update standings
        p1Standing.matchPoints += p1Points;
        p1Standing.gamesWon += match.player1GamesWon;
        p1Standing.gamesPlayed += match.player1GamesWon + match.player2GamesWon;
        p1Standing.opponents.push(p2Id);

        p2Standing.matchPoints += p2Points;
        p2Standing.gamesWon += match.player2GamesWon;
        p2Standing.gamesPlayed += match.player1GamesWon + match.player2GamesWon;
        p2Standing.opponents.push(p1Id);
      }
    }

    // Calculate OMW for each player
    const podScoreRepo = this.appDataSource.getRepository(PlayerPodScore);
    const podHistoryRepo = this.appDataSource.getRepository(
      PlayerPodScoreHistory,
    );

    for (const [playerId, standing] of standingsMap.entries()) {
      // Calculate OMW (opponent match win percentage)
      let omw = 0;
      if (standing.opponents.length > 0) {
        const opponentMatchPointPercentages = standing.opponents.map(
          (oppId) => {
            const oppStanding = standingsMap.get(oppId);
            if (!oppStanding || oppStanding.opponents.length === 0) {
              return 1 / 3; // Default to 33% if opponent has no matches
            }
            return Math.max(
              1 / 3,
              oppStanding.matchPoints /
                (Math.max(oppStanding.opponents.length, 1) * 3),
            );
          },
        );
        omw =
          opponentMatchPointPercentages.reduce((a, b) => a + b, 0) /
          standing.opponents.length;
      }

      // Update current standings
      await podScoreRepo.upsert(
        {
          playerId,
          podId,
          matchPoints: standing.matchPoints,
          opponentMatchWinPercentage: omw,
          gamesWon: standing.gamesWon,
          gamesPlayed: standing.gamesPlayed,
        },
        ["playerId", "podId"],
      );

      // Save history snapshot
      await podHistoryRepo.insert({
        playerId,
        podId,
        roundId: round.id,
        matchPoints: standing.matchPoints,
        opponentMatchWinPercentage: omw,
        gamesWon: standing.gamesWon,
        gamesPlayed: standing.gamesPlayed,
      });
    }

    // Award draft wins to players who won all their matches in the draft pod
    // This only happens on the last round of the draft
    if (round.roundNumber === pod.draft.lastRound) {
      for (const [playerId, standing] of standingsMap.entries()) {
        // A player has won all matches if they have 3 points per match played
        // (3 points per win, 0 for loss, 1 for draw)
        // So matchPoints === 3 * opponents.length means all wins
        if (
          standing.opponents.length > 0 &&
          standing.matchPoints === 3 * standing.opponents.length
        ) {
          await this.awardDraftWin(round.tournamentId, playerId);
        }
      }
    }
  }
}
