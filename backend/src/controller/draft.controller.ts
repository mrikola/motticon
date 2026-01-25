import { Service } from "typedi";
import {
  Route,
  Controller,
  Get,
  Post,
  Path,
  Security,
  UploadedFile,
  Request,
  Header,
} from "tsoa";
import { DraftService } from "../service/draft.service";
import {
  DraftDto,
  DraftPodDto,
  DraftPodSeatDto,
  DraftPodStandingsRowDto,
  draftToDto,
  podToDto,
  seatToDto,
} from "../dto/draft.dto";
import { RoundDto, roundToDto, MatchDto, matchToDto } from "../dto/round.dto";
import path from "path";
import { removeScandinavianLetters } from "../util/fs";
import mime from "mime-types";
import { getUserFromToken } from "../auth/auth";
import express from "express";
import { R2StorageService } from "../service/r2-storage.service";

@Route("draft")
@Service()
export class DraftController extends Controller {
  constructor(
    private draftService: DraftService,
    private r2StorageService: R2StorageService
  ) {
    super();
  }

  @Get("pods/{draftId}")
  @Security("loggedIn")
  public async getPodsForDraft(
    @Path() draftId: number,
  ): Promise<DraftPodDto[]> {
    return (await this.draftService.getPodsForDraft(draftId)).map(podToDto);
  }

  @Get("seats/{draftPodId}")
  @Security("loggedIn")
  public async getSeatsForPod(
    @Path() draftPodId: number,
  ): Promise<DraftPodSeatDto[]> {
    return (await this.draftService.getSeatsForPod(draftPodId)).map(seatToDto);
  }

  @Get("{draftId}/user/{userId}")
  @Security("loggedIn")
  public async getDraftInfoForUser(
    @Path() draftId: number,
    @Path() userId: number,
  ): Promise<DraftPodDto> {
    return podToDto(
      await this.draftService.getDraftInfoForUser(draftId, userId),
    );
  }

  @Get("{draftId}/rounds")
  @Security("loggedIn")
  public async getRoundsForDraft(@Path() draftId: number): Promise<RoundDto[]> {
    return (await this.draftService.getRoundsForDraft(draftId)).map(roundToDto);
  }

  @Get("pod/{podId}/standings")
  @Security("loggedIn")
  public async getPodStandings(
    @Path() podId: number,
  ): Promise<DraftPodStandingsRowDto[]> {
    return await this.draftService.getPodStandings(podId);
  }

  @Get("pod/{podId}/matches")
  @Security("loggedIn")
  public async getPodMatches(@Path() podId: number): Promise<MatchDto[]> {
    return (await this.draftService.getPodMatches(podId)).map(matchToDto);
  }

  @Post("tournament/{tournamentId}/submitDeck/{seatId}")
  @Security("loggedIn")
  public async submitDeck(
    @Request() request: express.Request,
    @Path() tournamentId: number,
    @Path() seatId: number,
    @UploadedFile() file: Express.Multer.File,
    @Header("authorization") token: string,
  ): Promise<DraftDto> {
    const user = getUserFromToken(token);
    if (!user) {
      throw new Error("User not found");
    }

    const extension = mime.extension(file.mimetype);
    if (!extension) {
      throw new Error("Unable to determine file extension from MIME type");
    }

    const fileName = removeScandinavianLetters(
      `deck_${user.firstName}_${user.lastName}.${extension}`,
    );

    // Construct the key (path) for R2 storage: tournamentId/seatId/filename
    const key = path.join(
      tournamentId.toString(),
      seatId.toString(),
      fileName,
    ).replace(/\\/g, "/"); // Ensure forward slashes for R2

    // Upload to R2 and get public URL
    const url = await this.r2StorageService.uploadFile(
      file.buffer,
      key,
      file.mimetype,
    );

    return draftToDto(
      await this.draftService.setDeckPhotoForUser(tournamentId, seatId, url),
    );
  }
}
