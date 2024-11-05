import { Service, Inject } from 'typedi';
import { DataSource } from 'typeorm';
import { DraftPod } from '../entity/DraftPod';
import { DraftPodSeat } from '../entity/DraftPodSeat';
import { Round } from '../entity/Round';
import { TournamentService } from './tournament.service';
import { Draft } from '../entity/Draft';
import { LRUCache } from 'lru-cache';
import { CardService } from './card.service';
import { PickedCard } from '../entity/PickedCard';

@Service()
export class DraftService {
    private userDraftPodCache: LRUCache<string, DraftPod>;

    constructor(
        @Inject('DataSource') private appDataSource: DataSource,
        @Inject('TournamentService') private tournamentService: TournamentService,
        @Inject('CardService') private cardService: CardService
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
            console.log("draft pod cache hit", identifier);
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
}
