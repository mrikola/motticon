import { Service, Inject } from "typedi";
import { DataSource } from "typeorm";
import { DraftPod } from "../entity/DraftPod";
import { DraftPodSeat } from "../entity/DraftPodSeat";
import { Round } from "../entity/Round";
import { TournamentService } from "./tournament.service";
import { Draft } from "../entity/Draft";
import { LRUCache } from "lru-cache";
import { CardService } from "./card.service";
import { PickedCard } from "../entity/PickedCard";
import { Match } from "../entity/Match";
import { MatchService } from "./match.service";
import { PlayerPodScore } from "../entity/PlayerPodScore";

@Service()
export class DraftService {
  private userDraftPodCache: LRUCache<string, DraftPod>;

  constructor(
    @Inject("DataSource") private appDataSource: DataSource,
    @Inject("TournamentService") private tournamentService: TournamentService,
    @Inject("CardService") private cardService: CardService,
    @Inject("MatchService") private matchService: MatchService
  ) {
    this.userDraftPodCache = new LRUCache({
      ttl: 1000 * 10,
      ttlAutopurge: true,
    });
  }

  async getPodsForDraft(draftId: number): Promise<DraftPod[]> {
    return await this.appDataSource
      .getRepository(DraftPod)
      .createQueryBuilder("pod")
      .leftJoinAndSelect("pod.cube", "cube")
      .where('pod."draftId" = :draftId', { draftId })
      .getMany();
  }

  async getSeatsForPod(draftPodId: number): Promise<DraftPodSeat[]> {
    return await this.appDataSource
      .getRepository(DraftPodSeat)
      .createQueryBuilder("seat")
      .leftJoinAndSelect("seat.player", "player")
      .where('seat."podId" = :draftPodId', { draftPodId })
      .getMany();
  }

  async getDraftInfoForUser(
    draftId: number,
    userId: number
  ): Promise<DraftPod> {
    const identifier = `${draftId}.${userId}`;
    const cachedPod = this.userDraftPodCache.get(identifier);

    if (cachedPod) {
      return cachedPod;
    }
    const pod = await this.appDataSource
      .getRepository(DraftPod)
      .createQueryBuilder("pod")
      .leftJoinAndSelect("pod.cube", "cube")
      .leftJoinAndSelect("cube.cardlist", "cardlist")
      .leftJoinAndSelect("cardlist.cards", "listedcards")
      .leftJoinAndSelect("listedcards.card", "card")
      .leftJoinAndSelect("listedcards.pickedCards", "pickedCards")
      .leftJoinAndSelect("pickedCards.picker", "picker")
      .leftJoinAndSelect("pickedCards.listedCard", "listedCard")
      .leftJoinAndSelect("listedCard.card", "lcCard")
      .leftJoinAndSelect("lcCard.tokens", "tokens")
      .leftJoinAndSelect("pod.seats", "seats")
      .leftJoinAndSelect("seats.player", "player")
      .where('pod."draftId" = :draftId', { draftId })
      .andWhere("player.id = :userId", { userId })
      .getOne();
    this.userDraftPodCache.set(identifier, pod);
    return pod;
  }

  async getRoundsForDraft(draftId: number): Promise<Round[]> {
    return await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .leftJoinAndSelect("round.matches", "match")
      .leftJoin("round.tournament", "tournament")
      .leftJoin("tournament.drafts", "draft")
      .where("draft.id = :draftId", { draftId })
      .andWhere(
        'round."roundNumber" between draft."firstRound" and draft."lastRound"'
      )
      .getMany();
  }

  async setDeckPhotoForUser(
    tournamentId: number,
    seatId: number,
    url?: string
  ): Promise<Draft> {
    // consider moving this to tournament.service
    await this.appDataSource
      .getRepository(DraftPodSeat)
      .createQueryBuilder("seat")
      .update(DraftPodSeat)
      .set({
        deckPhotoUrl: url ?? "/public/img/draft_pool.png",
      })
      .where("id = :seatId", { seatId })
      .execute();
    const draft = await this.tournamentService.getCurrentDraft(tournamentId);
    return draft;
  }

  async submitRandomPool(
    tournamentId: number,
    seat: DraftPodSeat
  ): Promise<Draft> {
    const draft: Draft = await this.setDeckPhotoForUser(tournamentId, seat.id);
    const cards: PickedCard[] = await this.cardService.setRandomPickedCards(
      seat
    );
    console.log("added these random cards for seat " + seat.seat);
    console.log(cards);
    return draft;
  }

  async setDraftPoolReturned(
    tournamentId: number,
    seatId: number
  ): Promise<Draft> {
    // try to return cards (delete PickedCards assigned to this seat)
    const success: boolean = await this.cardService.playerReturnedCards(seatId);
    // if succesful, set the draftPoolReturned status for this seat
    if (success) {
      await this.appDataSource
        .getRepository(DraftPodSeat)
        .createQueryBuilder("seat")
        .update(DraftPodSeat)
        .set({
          draftPoolReturned: true,
        })
        .where("id = :seatId", { seatId })
        .execute();
      const draft = await this.tournamentService.getCurrentDraft(tournamentId);
      return draft;
    } else {
      return null;
    }
  }

  async getPodStandings(podId: number): Promise<
    Array<{
      playerId: number;
      firstName: string;
      lastName: string;
      matchPoints: number;
      gamesWon: number;
      gamesPlayed: number;
      opponentMatchWinPercentage: number;
    }>
  > {
    // Get the pod with seats and draft info
    const pod = await this.appDataSource
      .getRepository(DraftPod)
      .createQueryBuilder("pod")
      .leftJoinAndSelect("pod.seats", "seats")
      .leftJoinAndSelect("seats.player", "player")
      .leftJoinAndSelect("pod.draft", "draft")
      .leftJoinAndSelect("draft.tournament", "tournament")
      .where("pod.id = :podId", { podId })
      .andWhere("draft.status = :status", { status: "completed" })
      .getOne();

    if (!pod || !pod.draft || !pod.draft.tournament) {
      throw new Error(
        `Pod ${podId} not found or missing draft/tournament relation`
      );
    }

    const playerIds = pod.seats.map((seat) => seat.player.id);

    // Get all completed rounds in this draft
    const rounds = await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .where('round."tournamentId" = :tournamentId', {
        tournamentId: pod.draft.tournament.id,
      })
      .andWhere('round."roundNumber" >= :firstRound', {
        firstRound: pod.draft.firstRound,
      })
      .andWhere('round."roundNumber" <= :lastRound', {
        lastRound: pod.draft.lastRound,
      })
      .andWhere("round.status = :status", { status: "completed" })
      .orderBy('round."roundNumber"', "ASC")
      .getMany();

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

    // Process all matches in completed rounds
    for (const round of rounds) {
      const matches = await this.matchService.getMatchesForRoundByPlayers(
        round.id,
        playerIds
      );

      // Only count matches where both players are in this pod
      const podMatches = matches.filter(
        (match) =>
          (match.pod?.id === podId || match.podId === podId) &&
          playerIds.includes(match.player1.id) &&
          playerIds.includes(match.player2.id)
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
    }

    // Calculate OMW for each player
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

      // Add OMW to the standing
      (standing as any).opponentMatchWinPercentage = omw;
    }

    // Convert to array and sort by match points, then OMW
    const standings = Array.from(standingsMap.entries())
      .map(([playerId, stats]) => {
        const seat = pod.seats.find((s) => s.player.id === playerId);
        return {
          playerId,
          firstName: seat?.player.firstName ?? "",
          lastName: seat?.player.lastName ?? "",
          matchPoints: stats.matchPoints,
          gamesWon: stats.gamesWon,
          gamesPlayed: stats.gamesPlayed,
          opponentMatchWinPercentage: (stats as any).opponentMatchWinPercentage,
        };
      })
      .sort((a, b) => {
        if (b.matchPoints !== a.matchPoints) {
          return b.matchPoints - a.matchPoints;
        }
        return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
      });

    return standings;
  }

  async getPodMatches(podId: number): Promise<Match[]> {
    // Get the pod with draft and tournament info
    const pod = await this.appDataSource
      .getRepository(DraftPod)
      .createQueryBuilder("pod")
      .leftJoinAndSelect("pod.draft", "draft")
      .leftJoinAndSelect("draft.tournament", "tournament")
      .where("pod.id = :podId", { podId })
      .getOne();

    if (!pod || !pod.draft || !pod.draft.tournament) {
      throw new Error(
        `Pod ${podId} not found or missing draft/tournament relation`
      );
    }

    // Get all rounds in this draft
    const rounds = await this.appDataSource
      .getRepository(Round)
      .createQueryBuilder("round")
      .where('round."tournamentId" = :tournamentId', {
        tournamentId: pod.draft.tournament.id,
      })
      .andWhere('round."roundNumber" >= :firstRound', {
        firstRound: pod.draft.firstRound,
      })
      .andWhere('round."roundNumber" <= :lastRound', {
        lastRound: pod.draft.lastRound,
      })
      .orderBy('round."roundNumber"', "ASC")
      .getMany();

    // Get all matches for these rounds that belong to this pod
    const allMatches: Match[] = [];
    for (const round of rounds) {
      const matches = await this.matchService.getMatchesForRound(round.id);
      const podMatches = matches.filter(
        (match) =>
          (match.pod?.id === podId || match.podId === podId) &&
          match.player1 &&
          match.player2
      );
      allMatches.push(...podMatches);
    }

    return allMatches;
  }
}
