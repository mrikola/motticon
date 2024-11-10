import { Service } from 'typedi';
import { Route, Controller, Get, Post, Path, Body, Security } from 'tsoa';
import { RatingService } from "../service/rating.service";

@Route('rating')
@Service()
export class RatingController extends Controller {
    constructor(
        private ratingService: RatingService
    ) {
        super();
    }

    @Post('updateElo')
    @Security('admin')
    public async updateElo(
        @Body() data: {
            kValue: number;
            player1Id: number;
            player2Id: number;
            winnerNumber: number;
        }
    ): Promise<void> {
        const { kValue, player1Id, player2Id, winnerNumber } = data;
        await this.ratingService.updateElo(kValue, player1Id, player2Id, winnerNumber);
    }

    @Get('resetElo/{playerId}')
    @Security('admin')
    public async resetEloForUser(
        @Path() playerId: number
    ): Promise<void> {
        await this.ratingService.resetEloForUser(playerId);
    }
}

