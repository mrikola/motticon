import { Service, Inject } from "typedi";
import { DataSource, Repository } from "typeorm";
import { Match } from "../entity/Match";
import { Round } from "../entity/Round";
import { TournamentService } from "./tournament.service";
import { MatchService } from "./match.service";
import { MatchDto, matchToDto } from "../dto/round.dto";
import { DraftPod } from "../entity/DraftPod";
import { DraftPodSeat } from "../entity/DraftPodSeat";
import { PlayerPodScore } from "../entity/PlayerPodScore";
import { User } from "../entity/User";
import { Draft } from "../entity/Draft";
import { PodDraftMatch } from "../dto/draft.dto";

@Service()
export class PairingsService {
  constructor(
    @Inject("DataSource") private appDataSource: DataSource,
    private tournamentService: TournamentService,
    private matchService: MatchService
  ) {}

  private winnerFrom(match: Match): User {
    if (!match) {
      throw new Error("Match is required to determine winner");
    }
    return match.player1GamesWon > match.player2GamesWon
      ? match.player1
      : match.player2;
  }

  private loserFrom(match: Match): User {
    if (!match) {
      throw new Error("Match is required to determine loser");
    }
    return match.player1GamesWon < match.player2GamesWon
      ? match.player1
      : match.player2;
  }

  private findMatchByType(
    matches: Match[],
    matchType: PodDraftMatch
  ): Match | undefined {
    return matches.find((match) => match.matchType === matchType);
  }

  private findSeatByNumber(seats: DraftPodSeat[], seatNumber: number): User {
    const seat = seats.find((s) => s.seat === seatNumber);
    if (!seat) {
      throw new Error(`Seat ${seatNumber} not found in pod`);
    }
    return seat.player;
  }

  private createMatch(
    matchRepo: Repository<Match>,
    round: Round,
    pod: DraftPod,
    player1: User,
    player2: User,
    tableNumber: number,
    matchType: PodDraftMatch
  ): Match {
    return matchRepo.create({
      round,
      pod,
      podId: pod.id, // Explicitly set podId to ensure it's saved
      player1,
      player2,
      tableNumber,
      matchType,
    });
  }

  /**
   * Calculate pod standings for Swiss pairings
   */
  private async getPodStandings(
    pod: DraftPod,
    draft: any,
    currentRound: Round
  ): Promise<
    Array<{
      player: User;
      matchPoints: number;
      opponentMatchWinPercentage: number;
      opponents: number[];
    }>
  > {
    const playerIds = pod.seats.map((seat) => seat.player.id);

    // Get pod scores from database if available
    const podScores = await this.appDataSource
      .getRepository(PlayerPodScore)
      .find({
        where: { podId: pod.id },
        relations: ["player"],
      });

    const standingsMap = new Map<
      number,
      {
        player: User;
        matchPoints: number;
        opponentMatchWinPercentage: number;
        opponents: number[];
      }
    >();

    // Initialize with pod scores if available, otherwise start fresh
    pod.seats.forEach((seat) => {
      const podScore = podScores.find((ps) => ps.playerId === seat.player.id);
      standingsMap.set(seat.player.id, {
        player: seat.player,
        matchPoints: podScore?.matchPoints ?? 0,
        opponentMatchWinPercentage: podScore?.opponentMatchWinPercentage ?? 0,
        opponents: [],
      });
    });

    // Get all previous rounds in this draft
    if (currentRound.roundNumber > draft.firstRound) {
      const previousRounds = await this.appDataSource
        .getRepository(Round)
        .createQueryBuilder("round")
        .where('round."tournamentId" = :tournamentId', {
          tournamentId: currentRound.tournamentId,
        })
        .andWhere('round."roundNumber" >= :firstRound', {
          firstRound: draft.firstRound,
        })
        .andWhere('round."roundNumber" < :currentRound', {
          currentRound: currentRound.roundNumber,
        })
        .andWhere("round.status = :status", { status: "completed" })
        .getMany();

      // Get matches and track opponents
      for (const prevRound of previousRounds) {
        const matches = await this.matchService.getMatchesForRoundByPlayers(
          prevRound.id,
          playerIds
        );

        const podMatches = matches.filter(
          (match) =>
            match.pod?.id === pod.id &&
            playerIds.includes(match.player1.id) &&
            playerIds.includes(match.player2.id)
        );

        for (const match of podMatches) {
          const p1Id = match.player1.id;
          const p2Id = match.player2.id;
          const p1Standing = standingsMap.get(p1Id);
          const p2Standing = standingsMap.get(p2Id);

          if (p1Standing && !p1Standing.opponents.includes(p2Id)) {
            p1Standing.opponents.push(p2Id);
          }
          if (p2Standing && !p2Standing.opponents.includes(p1Id)) {
            p2Standing.opponents.push(p1Id);
          }
        }
      }
    }

    return Array.from(standingsMap.values());
  }

  /**
   * Generate Swiss pairings for a pod
   */
  private async generateSwissPairings(
    pod: DraftPod,
    standings: Array<{
      player: User;
      matchPoints: number;
      opponentMatchWinPercentage: number;
      opponents: number[];
    }>,
    currentRound: Round,
    numberOfPods: number
  ): Promise<Match[]> {
    const matchRepo = this.appDataSource.getRepository(Match);

    // Sort by match points (desc), then OMW (desc)
    const sorted = standings.sort((a, b) => {
      if (a.matchPoints !== b.matchPoints) {
        return b.matchPoints - a.matchPoints;
      }
      return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
    });

    const pairings: Match[] = [];
    const used = new Set<number>();
    let tableOffset = 0;

    // Standard Swiss pairing: pair top vs bottom of each bracket
    // Avoid rematches when possible
    for (let i = 0; i < sorted.length; i++) {
      if (used.has(sorted[i].player.id)) continue;

      // Find best opponent (similar record, no rematch)
      let opponent: (typeof sorted)[number] | null = null;

      // First pass: find opponent with similar record and no rematch
      for (let j = i + 1; j < sorted.length; j++) {
        if (used.has(sorted[j].player.id)) continue;

        // Check for rematch
        if (sorted[i].opponents.includes(sorted[j].player.id)) {
          continue;
        }

        // Prefer similar record (within 3 points)
        const pointDiff = Math.abs(
          sorted[i].matchPoints - sorted[j].matchPoints
        );
        if (pointDiff <= 3) {
          opponent = sorted[j];
          break;
        }
      }

      // Second pass: if no suitable opponent found, pair with next available
      if (!opponent) {
        for (let j = i + 1; j < sorted.length; j++) {
          if (!used.has(sorted[j].player.id)) {
            opponent = sorted[j];
            break;
          }
        }
      }

      if (opponent) {
        pairings.push(
          this.createMatch(
            matchRepo,
            currentRound,
            pod,
            sorted[i].player,
            opponent.player,
            pod.podNumber + numberOfPods * tableOffset++,
            "swiss"
          )
        );
        used.add(sorted[i].player.id);
        used.add(opponent.player.id);
      }
    }

    return await matchRepo.save(pairings);
  }

  /**
   * Generate bracket pairings for round 1 (8-player pod)
   */
  private generateRound1BracketPairings(
    matchRepo: Repository<Match>,
    pod: DraftPod,
    currentRound: Round,
    numberOfPods: number
  ): Match[] {
    const { seats } = pod;
    return [
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.findSeatByNumber(seats, 1),
        this.findSeatByNumber(seats, 5),
        pod.podNumber + numberOfPods * 0,
        "1v5"
      ),
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.findSeatByNumber(seats, 3),
        this.findSeatByNumber(seats, 7),
        pod.podNumber + numberOfPods * 1,
        "3v7"
      ),
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.findSeatByNumber(seats, 2),
        this.findSeatByNumber(seats, 6),
        pod.podNumber + numberOfPods * 2,
        "2v6"
      ),
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.findSeatByNumber(seats, 4),
        this.findSeatByNumber(seats, 8),
        pod.podNumber + numberOfPods * 3,
        "4v8"
      ),
    ];
  }

  /**
   * Generate bracket pairings for round 2 (8-player pod)
   */
  private generateRound2BracketPairings(
    matchRepo: Repository<Match>,
    pod: DraftPod,
    currentRound: Round,
    numberOfPods: number,
    previousRoundMatches: Match[]
  ): Match[] {
    return [
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.winnerFrom(this.findMatchByType(previousRoundMatches, "1v5")!),
        this.winnerFrom(this.findMatchByType(previousRoundMatches, "3v7")!),
        pod.podNumber + numberOfPods * 0,
        "oddsWinners"
      ),
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.winnerFrom(this.findMatchByType(previousRoundMatches, "2v6")!),
        this.winnerFrom(this.findMatchByType(previousRoundMatches, "4v8")!),
        pod.podNumber + numberOfPods * 1,
        "evensWinners"
      ),
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.loserFrom(this.findMatchByType(previousRoundMatches, "1v5")!),
        this.loserFrom(this.findMatchByType(previousRoundMatches, "3v7")!),
        pod.podNumber + numberOfPods * 2,
        "oddsLosers"
      ),
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.loserFrom(this.findMatchByType(previousRoundMatches, "2v6")!),
        this.loserFrom(this.findMatchByType(previousRoundMatches, "4v8")!),
        pod.podNumber + numberOfPods * 3,
        "evensLosers"
      ),
    ];
  }

  /**
   * Generate bracket pairings for round 3 (8-player pod)
   */
  private generateRound3BracketPairings(
    matchRepo: Repository<Match>,
    pod: DraftPod,
    currentRound: Round,
    numberOfPods: number,
    previousRoundMatches: Match[]
  ): Match[] {
    return [
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.winnerFrom(
          this.findMatchByType(previousRoundMatches, "oddsWinners")!
        ),
        this.winnerFrom(
          this.findMatchByType(previousRoundMatches, "evensWinners")!
        ),
        pod.podNumber + numberOfPods * 0,
        "final"
      ),
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.winnerFrom(
          this.findMatchByType(previousRoundMatches, "oddsLosers")!
        ),
        this.loserFrom(
          this.findMatchByType(previousRoundMatches, "evensWinners")!
        ),
        pod.podNumber + numberOfPods * 1,
        "mid1"
      ),
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.winnerFrom(
          this.findMatchByType(previousRoundMatches, "evensLosers")!
        ),
        this.loserFrom(
          this.findMatchByType(previousRoundMatches, "oddsWinners")!
        ),
        pod.podNumber + numberOfPods * 2,
        "mid2"
      ),
      this.createMatch(
        matchRepo,
        currentRound,
        pod,
        this.loserFrom(
          this.findMatchByType(previousRoundMatches, "oddsLosers")!
        ),
        this.loserFrom(
          this.findMatchByType(previousRoundMatches, "evensLosers")!
        ),
        pod.podNumber + numberOfPods * 3,
        "jumbofinal"
      ),
    ];
  }

  /**
   * Generate bracket pairings for a pod
   */
  private async generateBracketPairings(
    pod: DraftPod,
    draft: Draft,
    currentRound: Round,
    previousRound: Round | null,
    numberOfPods: number
  ): Promise<Match[]> {
    const matchRepo = this.appDataSource.getRepository(Match);
    const roundInDraft = currentRound.roundNumber - draft.firstRound + 1;

    // Get previous round matches if not round 1
    const previousRoundMatches: Match[] =
      roundInDraft > 1 && previousRound
        ? await this.matchService.getMatchesForRoundByPlayers(
            previousRound.id,
            pod.seats.map((seat) => seat.player.id)
          )
        : [];

    let matches: Match[];

    switch (roundInDraft) {
      case 1:
        matches = this.generateRound1BracketPairings(
          matchRepo,
          pod,
          currentRound,
          numberOfPods
        );
        break;
      case 2:
        matches = this.generateRound2BracketPairings(
          matchRepo,
          pod,
          currentRound,
          numberOfPods,
          previousRoundMatches
        );
        break;
      case 3:
        matches = this.generateRound3BracketPairings(
          matchRepo,
          pod,
          currentRound,
          numberOfPods,
          previousRoundMatches
        );
        break;
      default:
        throw new Error(
          `Unsupported round number in draft: ${roundInDraft}. Bracket pairings only support rounds 1-3.`
        );
    }

    return await matchRepo.save(matches);
  }

  async generatePairings(
    tournamentId: number,
    draftId: number,
    roundId: number
  ): Promise<MatchDto[]> {
    const tournament = await this.tournamentService.getTournamentAndDrafts(
      tournamentId
    );

    const draft = tournament.drafts.find((draft) => draft.id === draftId);
    if (!draft) {
      throw new Error(
        `Draft ${draftId} not found in tournament ${tournamentId}`
      );
    }

    const currentRound = await this.appDataSource.getRepository(Round).findOne({
      where: { id: roundId },
    });
    if (!currentRound) {
      throw new Error(`Round ${roundId} not found`);
    }

    const previousRound = await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .where('round."tournamentId" = :tournamentId', {
        tournamentId: tournament.id,
      })
      .andWhere('round."roundNumber" = :roundNumber', {
        roundNumber: currentRound.roundNumber - 1,
      })
      .getOne();

    this.tournamentService.initiateRound(tournamentId, roundId);
    const { pods } = draft;
    const numberOfPods = pods.length;

    // Generate pairings based on tournament pairing mode
    const pairings = await Promise.all(
      pods.map(async (pod): Promise<Match[]> => {
        if (tournament.pairingMode === "swiss") {
          const standings = await this.getPodStandings(
            pod,
            draft,
            currentRound
          );
          return await this.generateSwissPairings(
            pod,
            standings,
            currentRound,
            numberOfPods
          );
        } else {
          return await this.generateBracketPairings(
            pod,
            draft,
            currentRound,
            previousRound,
            numberOfPods
          );
        }
      })
    );

    return pairings.flat().map(matchToDto);
  }
}
