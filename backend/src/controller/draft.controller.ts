import { Container } from '../container';
import { Service } from 'typedi';
import { Route, Controller, Get, Post, Path, Security, UploadedFile, Request, Header } from 'tsoa';
import { DraftService } from '../service/draft.service';
import { DraftDto, DraftPodDto, DraftPodSeatDto, draftToDto, podToDto, seatToDto } from '../dto/draft.dto';
import { RoundDto, roundToDto } from '../dto/round.dto';
import path from 'path';
import { FILE_ROOT, createDirIfNotExists, removeScandinavianLetters } from '../util/fs';
import { writeFileSync } from 'fs';
import mime from 'mime-types';
import { getUserFromToken } from '../auth/auth';

@Route('draft')
@Service()
export class DraftController extends Controller {
    constructor(
        private draftService: DraftService
    ) {
        super();
    }

    @Get('pods/{draftId}')
    @Security('loggedIn')
    public async getPodsForDraft(@Path() draftId: number): Promise<DraftPodDto[]> {
        return (await this.draftService.getPodsForDraft(draftId)).map(podToDto);
    }

    @Get('seats/{draftPodId}')
    @Security('loggedIn')
    public async getSeatsForPod(@Path() draftPodId: number): Promise<DraftPodSeatDto[]> {
        return (await this.draftService.getSeatsForPod(draftPodId)).map(seatToDto);
    }

    @Get('{draftId}/user/{userId}')
    @Security('loggedIn')
    public async getDraftInfoForUser(
        @Path() draftId: number,
        @Path() userId: number
    ): Promise<DraftPodDto> {
        return podToDto(
            await this.draftService.getDraftInfoForUser(draftId, userId)
        );
    }

    @Get('{draftId}/rounds')
    @Security('loggedIn')
    public async getRoundsForDraft(@Path() draftId: number): Promise<RoundDto[]> {
        return (await this.draftService.getRoundsForDraft(draftId)).map(roundToDto);
    }

    @Post('tournament/{tournamentId}/submitDeck/{seatId}')
    @Security('loggedIn')
    public async submitDeck(
        @Path() tournamentId: number,
        @Path() seatId: number,
        @UploadedFile() file: Express.Multer.File,
        @Header("authorization") token: string
    ): Promise<DraftDto> {
        const user = getUserFromToken(token);
        if (!user) {
            throw new Error('User not found');
        }

        const filePath = path.join(FILE_ROOT, tournamentId.toString(), seatId.toString());
        createDirIfNotExists(filePath);

        const extension = mime.extension(file.mimetype);
        const fileName = removeScandinavianLetters(`deck_${user.firstName}_${user.lastName}.${extension}`);
        const localFileFullPath = path.join(filePath, fileName);
        writeFileSync(localFileFullPath, file.buffer);

        const url = `/public/${tournamentId}/${seatId}/${fileName}`;
        return draftToDto(
            await this.draftService.setDeckPhotoForUser(tournamentId, seatId, url)
        );
    }
}
