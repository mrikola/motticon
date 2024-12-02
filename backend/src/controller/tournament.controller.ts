import { Service } from 'typedi';
import { Route, Controller, Get, Post, Put, Delete, Path, Body, Security, Response } from 'tsoa';
import { TournamentService } from '../service/tournament.service';
import { EnrollmentService } from '../service/enrollment.service';
import { TournamentDto, tournamentToDto } from '../dto/tournaments.dto';
import { DraftDto, draftToDto } from '../dto/draft.dto';
import { MatchDto, matchToDto, RoundDto, roundToDto } from '../dto/round.dto';
import { CubeDto, cubeToDto } from '../dto/cube.dto';
import { ScoreService } from '../service/score.service';
import { CubeService } from '../service/cube.service';
import { writeFileSync } from 'fs';
import path from 'path';
import { format } from '@fast-csv/format';
import { createDirIfNotExists, FILE_ROOT } from '../util/fs';
import { text } from 'stream/consumers';
import { StandingsRow } from '../dto/score.dto';
import { PairingsService } from '../service/pairings.service';
import { DraftService } from '../service/draft.service';
import { MatchService } from '../service/match.service';
import { PlayerTournamentScoreDto, scoreToDto } from '../dto/user.dto';

@Route('tournament')
@Service()
export class TournamentController extends Controller {
    constructor(
        private tournamentService: TournamentService,
        private enrollmentService: EnrollmentService,
        private scoreService: ScoreService,
        private cubeService: CubeService,
        private pairingsService: PairingsService,
        private draftService: DraftService,
        private matchService: MatchService
    ) {
        super();
    }

    // Public endpoints (no auth required)
    @Get('{tournamentId}/round/{roundId}/results')
    @Response('200', 'Success', { contentType: 'text/csv' })
    public async generateCsvFromRound(
        @Path() tournamentId: number,
        @Path() roundId: number
    ): Promise<string> {
        const round = await this.tournamentService.getRound(tournamentId, roundId);
        const filePath = path.join(FILE_ROOT, tournamentId.toString(), roundId.toString());
        createDirIfNotExists(filePath);

        const fileName = `round${round.roundNumber}.csv`;
        const localFileFullPath = path.join(filePath, fileName);

        const stream = format({
            headers: [
                "Player 1",
                "P1 wins",
                "P1 match points",
                "Player 2",
                "P2 wins",
                "P2 match points",
            ],
        });

        for (let match of round.matches.sort((a, b) => a.tableNumber - b.tableNumber)) {
            const player1points = match.player1GamesWon > match.player2GamesWon ? 3 : 0;
            const player2points = match.player2GamesWon > match.player1GamesWon ? 3 : 0;
            stream.write([
                `${match.player1.firstName} ${match.player1.lastName}`,
                match.player1GamesWon,
                player1points,
                `${match.player2.firstName} ${match.player2.lastName}`,
                match.player2GamesWon,
                player2points,
            ]);
        }

        stream.end();
        const content = await text(stream);
        writeFileSync(localFileFullPath, content);

        // Set response headers
        this.setHeader('Content-Type', 'text/csv');
        this.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        return content;  // Return content instead of file path
    }

    // User-level endpoints
    @Get()
    @Security('loggedIn')
    public async getAllTournaments(): Promise<TournamentDto[]> {
        return (await this.tournamentService.getAllTournaments()).map(tournamentToDto);
    }

    @Get('future')
    @Security('loggedIn')
    public async getFutureTournaments(): Promise<TournamentDto[]> {
        return (await this.tournamentService.getFutureTournaments()).map(tournamentToDto);
    }

    @Get('past')
    @Security('loggedIn')
    public async getPastTournaments(): Promise<TournamentDto[]> {
        return (await this.tournamentService.getPastTournaments()).map(tournamentToDto);
    }

    @Get('ongoing')
    @Security('loggedIn')
    public async getOngoingTournaments(): Promise<TournamentDto[]> {
        return (await this.tournamentService.getOngoingTournaments()).map(tournamentToDto);
    }

    @Get('{tournamentId}')
    @Security('loggedIn')
    public async getTournament(@Path() tournamentId: number): Promise<TournamentDto> {
        return tournamentToDto(await this.tournamentService.getTournament(tournamentId));
    }

    @Get('{tournamentId}/enrollment')
    @Security('loggedIn')
    public async getTournamentEnrollments(@Path() tournamentId: number): Promise<TournamentDto> {
        return tournamentToDto(await this.tournamentService.getTournamentEnrollments(tournamentId));
    }

    @Get('{tournamentId}/drafts')
    @Security('loggedIn')
    public async getTournamentAndDrafts(@Path() tournamentId: number): Promise<TournamentDto> {
        return tournamentToDto(await this.tournamentService.getTournamentAndDrafts(tournamentId));
    }

    @Get('{tournamentId}/draft')
    @Security('loggedIn')
    public async getCurrentDraft(@Path() tournamentId: number): Promise<DraftDto> {
        return draftToDto(await this.tournamentService.getCurrentDraft(tournamentId));
    }

    @Get('{tournamentId}/round')
    @Security('loggedIn')
    public async getCurrentRound(@Path() tournamentId: number): Promise<RoundDto> {
        return roundToDto(await this.tournamentService.getCurrentRound(tournamentId));
    }

    @Get('{_tournamentId}/round/{roundId}/match/{playerId}')
    @Security('loggedIn')
    public async getMatch(@Path() _tournamentId: number, @Path() roundId: number, @Path() playerId: number): Promise<MatchDto> {
        return matchToDto(await this.tournamentService.getCurrentMatch(playerId, roundId));
    }

    @Get('{tournamentId}/round/recent')
    @Security('loggedIn')
    public async getMostRecentRound(@Path() tournamentId: number): Promise<RoundDto> {
        return roundToDto(await this.tournamentService.getMostRecentRound(tournamentId));
    }

    @Get('{tournamentId}/standings/{roundNumber}')
    @Security('loggedIn')
    public async getStandings(
        @Path() tournamentId: number,
        @Path() roundNumber: number
    ): Promise<StandingsRow[]> {
        return await this.scoreService.getStandings(tournamentId, roundNumber);
    }

    @Get('{tournamentId}/score/{userId}')
    @Security('loggedIn')
    public async getPreviousScore(
        @Path() tournamentId: number,
        @Path() userId: number
    ): Promise<PlayerTournamentScoreDto> {
        return scoreToDto(await this.scoreService.getPreviousScore(tournamentId, userId));
    }

    @Get('{id}/cubes')
    @Security('loggedIn')
    public async getCubesForTournament(@Path() id: number): Promise<CubeDto[]> {
        return (await this.cubeService.getCubesForTournament(id)).map(cubeToDto);
    }

    @Post('{tournamentId}/enroll/{userId}')
    @Security('loggedIn')
    public async enrollIntoTournament(
        @Path() tournamentId: number,
        @Path() userId: number
    ): Promise<TournamentDto> {
        return tournamentToDto(await this.enrollmentService.enrollIntoTournament(tournamentId, userId));
    }

    @Post('{tournamentId}/cancel/{userId}')
    @Security('loggedIn')
    public async cancelEnrollment(
        @Path() tournamentId: number,
        @Path() userId: number
    ): Promise<boolean> {
        return await this.enrollmentService.cancelEnrollment(tournamentId, userId);
    }

    @Post('{tournamentId}/drop/{userId}')
    @Security('loggedIn')
    public async dropFromTournament(
        @Path() tournamentId: number,
        @Path() userId: number
    ): Promise<TournamentDto> {
        return tournamentToDto(await this.enrollmentService.dropFromTournament(tournamentId, userId));
    }

    // Staff-level endpoints
    @Put('{tournamentId}/start')
    @Security('staff')
    public async startTournament(@Path() tournamentId: number): Promise<TournamentDto> {
        return tournamentToDto(await this.tournamentService.startTournament(tournamentId));
    }

    @Put('{tournamentId}/end')
    @Security('staff')
    public async endTournament(@Path() tournamentId: number): Promise<TournamentDto> {
        return tournamentToDto(await this.tournamentService.endTournament(tournamentId));
    }

    @Post('{tournamentId}/draft/generate')
    @Security('staff')
    public async generateDrafts(@Path() tournamentId: number): Promise<TournamentDto> {
        return tournamentToDto(await this.tournamentService.generateDrafts(tournamentId));
    }

    @Put('{tournamentId}/draft/{draftId}/initiate')
    @Security('staff')
    public async initiateDraft(
        @Path() tournamentId: number,
        @Path() draftId: number
    ): Promise<DraftDto> {
        return draftToDto(await this.tournamentService.initiateDraft(tournamentId, draftId));
    }

    @Put('{tournamentId}/draft/{draftId}/start')
    @Security('staff')
    public async startDraft(
        @Path() tournamentId: number,
        @Path() draftId: number
    ): Promise<DraftDto> {
        return draftToDto(await this.tournamentService.startDraft(tournamentId, draftId));
    }

    @Put('{tournamentId}/draft/{draftId}/end')
    @Security('staff')
    public async endDraft(
        @Path() tournamentId: number,
        @Path() draftId: number
    ): Promise<TournamentDto> {
        return tournamentToDto(await this.tournamentService.endDraft(tournamentId, draftId));
    }

    @Put('{tournamentId}/round/{roundId}/start')
    @Security('staff')
    public async startRound(
        @Path() tournamentId: number,
        @Path() roundId: number
    ): Promise<RoundDto> {
        return roundToDto(await this.tournamentService.startRound(tournamentId, roundId));
    }

    @Put('{tournamentId}/round/{roundId}/end')
    @Security('staff')
    public async endRound(
        @Path() tournamentId: number,
        @Path() roundId: number
    ): Promise<RoundDto> {
        return roundToDto(await this.tournamentService.endRound(tournamentId, roundId));
    }

    @Put('{tournamentId}/draft/{draftId}/round/{roundId}/pairings')
    @Security('staff')
    public async generatePairings(
        @Path() tournamentId: number,
        @Path() draftId: number,
        @Path() roundId: number
    ): Promise<MatchDto[]> {
        return await this.pairingsService.generatePairings(tournamentId, draftId, roundId);
    }

    @Post('staff/{tournamentId}/cancel/{userId}')
    @Security('staff')
    public async staffCancelEnrollment(
        @Path() tournamentId: number,
        @Path() userId: number
    ): Promise<TournamentDto> {
        return tournamentToDto(
            await this.enrollmentService.staffCancelEnrollment(tournamentId, userId)
        );
    }

    @Post('{tournamentId}/setDraftPoolReturned/{seatId}')
    @Security('staff')
    public async setDraftPoolReturned(
        @Path() tournamentId: number,
        @Path() seatId: number
    ): Promise<DraftDto> {
        console.log("returning draft pool for seat", seatId);
        return draftToDto(
            await this.draftService.setDraftPoolReturned(tournamentId, seatId)
        );
    }

    @Post('staff/{tournamentId}/submitResult')
    @Security('staff')
    public async staffSubmitResult(
        @Body() result: {
            roundId: number;
            matchId: number;
            resultSubmittedBy: number;
            player1GamesWon: number;
            player2GamesWon: number;
        }
    ): Promise<MatchDto[]> {
        const { roundId, matchId, resultSubmittedBy, player1GamesWon, player2GamesWon } = result;
        return (await this.matchService.staffSubmitResult(
            roundId,
            matchId,
            resultSubmittedBy,
            player1GamesWon,
            player2GamesWon
        )).map(matchToDto);
    }

    // Admin-level endpoints
    @Post('create')
    @Security('admin')
    public async createTournament(@Body() tournamentData: any): Promise<TournamentDto> {
        const { name, description, price, players, drafts, preferencesRequired, 
                startDate, endDate, cubeIds, userEnrollmentEnabled } = tournamentData;
        return tournamentToDto(await this.tournamentService.createTournament(
            name, description, price, players, drafts, preferencesRequired,
            startDate, endDate, cubeIds, userEnrollmentEnabled
        ));
    }

    @Get('{tournamentId}/staff')
    @Security('admin')
    public async getTournamentStaff(@Path() tournamentId: number): Promise<TournamentDto> {
        return tournamentToDto(await this.tournamentService.getTournamentStaff(tournamentId));
    }

    @Post('{tournamentId}/staff/{userId}/add')
    @Security('admin')
    public async addToStaff(
        @Path() tournamentId: number,
        @Path() userId: number
    ): Promise<TournamentDto> {
        return tournamentToDto(await this.tournamentService.addToStaff(tournamentId, userId));
    }

    @Post('{tournamentId}/staff/{userId}/remove')
    @Security('admin')
    public async removeFromStaff(
        @Path() tournamentId: number,
        @Path() userId: number
    ): Promise<TournamentDto> {
        return tournamentToDto(await this.tournamentService.removeFromStaff(tournamentId, userId));
    }

    @Post('{tournamentId}/setDeckPhoto/{seatId}')
    @Security('admin')
    public async setDeckPhotoForUser(
        @Path() tournamentId: number,
        @Path() seatId: number
    ): Promise<DraftDto> {
        return draftToDto(
            await this.draftService.setDeckPhotoForUser(tournamentId, seatId)
        );
    }


}
