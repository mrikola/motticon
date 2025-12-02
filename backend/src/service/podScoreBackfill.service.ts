import { Service, Inject } from "typedi";
import { DataSource, Repository } from "typeorm";
import { Tournament } from "../entity/Tournament";
import { Draft } from "../entity/Draft";
import { DraftPod } from "../entity/DraftPod";
import { Round } from "../entity/Round";
import { Match } from "../entity/Match";
import { PlayerPodScore } from "../entity/PlayerPodScore";
import { PlayerPodScoreHistory } from "../entity/PlayerPodScoreHistory";
import { MatchService } from "./match.service";

@Service()
export class PodScoreBackfillService {
  constructor(
    @Inject("DataSource") private appDataSource: DataSource,
    @Inject("MatchService") private matchService: MatchService
  ) {}

  /**
   * Backfill pod scores for all completed tournaments that don't have pod score data
   */
  async backfillPodScores(): Promise<void> {
    console.log("Starting pod score backfill job...");

    const tournamentRepo = this.appDataSource.getRepository(Tournament);
    const podScoreRepo = this.appDataSource.getRepository(PlayerPodScore);
    const podHistoryRepo = this.appDataSource.getRepository(
      PlayerPodScoreHistory
    );

    // Find all completed tournaments
    const tournaments = await tournamentRepo.find({
      where: {
        status: "completed",
      },
      relations: [
        "drafts",
        "drafts.pods",
        "drafts.pods.seats",
        "drafts.pods.seats.player",
      ],
    });

    console.log(`Found ${tournaments.length} completed tournaments`);

    let processedTournaments = 0;
    let processedPods = 0;

    for (const tournament of tournaments) {
      // Check if this tournament already has pod score data
      const hasPodScores = await podScoreRepo
        .createQueryBuilder("pps")
        .innerJoin("draft_pod", "dp", "dp.id = pps.podId")
        .innerJoin("draft", "d", "d.id = dp.draftId")
        .where("d.tournamentId = :tournamentId", {
          tournamentId: tournament.id,
        })
        .getCount();

      if (hasPodScores > 0) {
        console.log(
          `Tournament ${tournament.id} (${tournament.name}) already has pod scores, skipping`
        );
        continue;
      }

      console.log(
        `Processing tournament ${tournament.id} (${tournament.name})...`
      );

      // Get all drafts for this tournament, sorted by draft number
      const drafts = tournament.drafts.sort(
        (a, b) => a.draftNumber - b.draftNumber
      );

      for (const draft of drafts) {
        if (!draft.pods || draft.pods.length === 0) {
          continue;
        }

        for (const pod of draft.pods) {
          if (!pod.seats || pod.seats.length === 0) {
            continue;
          }

          await this.backfillPodScoresForPod(pod, draft, tournament.id);
          processedPods++;
        }
      }

      processedTournaments++;
    }

    console.log(
      `Pod score backfill completed. Processed ${processedTournaments} tournaments, ${processedPods} pods`
    );
  }

  /**
   * Backfill pod scores for a specific pod
   */
  private async backfillPodScoresForPod(
    pod: DraftPod,
    draft: Draft,
    tournamentId: number
  ): Promise<void> {
    const podScoreRepo = this.appDataSource.getRepository(PlayerPodScore);
    const podHistoryRepo = this.appDataSource.getRepository(
      PlayerPodScoreHistory
    );
    const roundRepo = this.appDataSource.getRepository(Round);
    const matchRepo = this.appDataSource.getRepository(Match);

    const playerIds = pod.seats
      .map((seat) => seat.player?.id)
      .filter((id): id is number => id !== undefined && id !== null);

    if (playerIds.length === 0) {
      console.warn(`Pod ${pod.id} has no players with valid IDs, skipping`);
      return;
    }

    // Get all completed rounds for this draft
    const rounds = await roundRepo
      .createQueryBuilder("round")
      .where('round."tournamentId" = :tournamentId', { tournamentId })
      .andWhere('round."roundNumber" >= :firstRound', {
        firstRound: draft.firstRound,
      })
      .andWhere('round."roundNumber" <= :lastRound', {
        lastRound: draft.lastRound,
      })
      .andWhere("round.status = :status", { status: "completed" })
      .orderBy('round."roundNumber"', "ASC")
      .getMany();

    if (rounds.length === 0) {
      return;
    }

    // Process rounds in chronological order, building up standings
    const standingsMap = new Map<
      number,
      {
        matchPoints: number;
        gamesWon: number;
        gamesPlayed: number;
        opponents: number[];
      }
    >();

    // Initialize standings for all players
    playerIds.forEach((playerId) => {
      standingsMap.set(playerId, {
        matchPoints: 0,
        gamesWon: 0,
        gamesPlayed: 0,
        opponents: [],
      });
    });

    let totalMatchesProcessed = 0;

    for (const round of rounds) {
      // Get matches for this round involving players in this pod
      const matches = await this.matchService.getMatchesForRoundByPlayers(
        round.id,
        playerIds
      );

      // Filter to only matches where both players are in this pod
      // For old tournaments, podId might be null, so we rely on both players being in the pod
      // and the round being part of this draft (which we already filtered)
      const podMatches = matches.filter((match) => {
        // Ensure both players are loaded
        if (!match.player1 || !match.player2) {
          return false;
        }

        const bothPlayersInPod =
          playerIds.includes(match.player1.id) &&
          playerIds.includes(match.player2.id);

        if (!bothPlayersInPod) {
          return false;
        }

        // If podId is set, verify it matches this pod
        // For old tournaments where podId might be null, we trust that if both players
        // are in the pod and it's in the right round range, it's a pod match
        if (match.podId !== null && match.podId !== undefined) {
          return match.podId === pod.id || match.pod?.id === pod.id;
        }

        // podId is null - for old tournaments, if both players are in the pod
        // and we're in the right round range, count it as a pod match
        return true;
      });

      if (podMatches.length === 0 && matches.length > 0) {
        const podIds = matches.map((m) => m.podId ?? "null").join(", ");
        console.warn(
          `Pod ${pod.id}: Found ${matches.length} matches in round ${round.roundNumber} but none matched pod filter. Match podIds: [${podIds}]`
        );
      }

      // Process matches for this round
      for (const match of podMatches) {
        totalMatchesProcessed++;

        // Update match.podId if it's not set (for legacy data)
        if (match.podId === null || match.podId === undefined) {
          await this.appDataSource.query(
            `UPDATE "match" SET "podId" = $1 WHERE "id" = $2`,
            [pod.id, match.id]
          );
          match.podId = pod.id;
        }

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
        if (!p1Standing.opponents.includes(p2Id)) {
          p1Standing.opponents.push(p2Id);
        }

        p2Standing.matchPoints += p2Points;
        p2Standing.gamesWon += match.player2GamesWon;
        p2Standing.gamesPlayed += match.player1GamesWon + match.player2GamesWon;
        if (!p2Standing.opponents.includes(p1Id)) {
          p2Standing.opponents.push(p1Id);
        }
      }

      // Calculate OMW for each player at this point in time
      for (const [playerId, standing] of standingsMap.entries()) {
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
                  (Math.max(oppStanding.opponents.length, 1) * 3)
              );
            }
          );
          omw =
            opponentMatchPointPercentages.reduce((a, b) => a + b, 0) /
            standing.opponents.length;
        }

        // Save history snapshot for this round
        await podHistoryRepo.insert({
          playerId,
          podId: pod.id,
          roundId: round.id,
          matchPoints: standing.matchPoints,
          opponentMatchWinPercentage: omw,
          gamesWon: standing.gamesWon,
          gamesPlayed: standing.gamesPlayed,
        });
      }
    }

    // If no matches were processed, skip inserting data (would be all zeros)
    if (totalMatchesProcessed === 0) {
      console.warn(
        `Pod ${pod.id}: No matches found for any rounds in draft ${draft.draftNumber}, skipping pod score insertion`
      );
      return;
    }

    // After processing all rounds, save final standings to PlayerPodScore
    for (const [playerId, standing] of standingsMap.entries()) {
      // Calculate final OMW
      let omw = 0;
      if (standing.opponents.length > 0) {
        const opponentMatchPointPercentages = standing.opponents.map(
          (oppId) => {
            const oppStanding = standingsMap.get(oppId);
            if (!oppStanding || oppStanding.opponents.length === 0) {
              return 1 / 3;
            }
            return Math.max(
              1 / 3,
              oppStanding.matchPoints /
                (Math.max(oppStanding.opponents.length, 1) * 3)
            );
          }
        );
        omw =
          opponentMatchPointPercentages.reduce((a, b) => a + b, 0) /
          standing.opponents.length;
      }

      // Upsert final standings
      await podScoreRepo.upsert(
        {
          playerId,
          podId: pod.id,
          matchPoints: standing.matchPoints,
          opponentMatchWinPercentage: omw,
          gamesWon: standing.gamesWon,
          gamesPlayed: standing.gamesPlayed,
        },
        ["playerId", "podId"]
      );
    }
  }
}
