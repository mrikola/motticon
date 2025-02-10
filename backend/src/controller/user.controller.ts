import { Service } from "typedi";
import {
  Route,
  Controller,
  Get,
  Post,
  Path,
  Body,
  Response,
  Security,
  Put,
} from "tsoa";
import {
  PlayerTournamentInfo,
  TournamentDto,
  tournamentToDto,
} from "../dto/tournaments.dto";
import {
  PlayerDto,
  PlayerWithRatingDto,
  playerToDto,
  playerToRatedDto,
} from "../dto/user.dto";
import { EnrollmentService } from "../service/enrollment.service";
import { UserService } from "../service/user.service";
import { MatchService } from "../service/match.service";
import { MatchDto, matchToDto } from "../dto/round.dto";
import { doLogin } from "../auth/auth";

interface LoginResponse {
  token: string;
}

@Route("user")
@Service()
export class UserController extends Controller {
  constructor(
    private userService: UserService,
    private enrollmentService: EnrollmentService,
    private matchService: MatchService
  ) {
    super();
  }

  @Post("signup")
  @Response(201, "Created")
  @Response(401, "Unauthorized")
  public async signup(@Body() user: any): Promise<void> {
    const { firstName, lastName, email, password } = user;
    const success = await this.userService.createUser(
      firstName,
      lastName,
      email,
      password
    );

    if (success) {
      this.setStatus(201); // Created
    } else {
      this.setStatus(401); // Unauthorized
    }
  }

  @Get("all")
  @Security("loggedIn")
  public async getAllUsers(): Promise<PlayerWithRatingDto[]> {
    return (await this.userService.getAllUsers()).map(playerToRatedDto);
  }

  @Get("exists/{email}")
  public async userExists(@Path() email: string): Promise<boolean> {
    return await this.userService.userExists(email);
  }

  @Get("{id}")
  @Security("loggedIn")
  public async getUser(@Path() id: number): Promise<PlayerWithRatingDto> {
    return playerToRatedDto(await this.userService.getUser(id));
  }

  @Get("{id}/tournaments")
  @Security("loggedIn")
  public async getUsersTournaments(
    @Path() id: number
  ): Promise<TournamentDto[]> {
    return (await this.userService.getUsersTournaments(id)).map(
      tournamentToDto
    );
  }

  @Get("{id}/staff")
  @Security("loggedIn")
  public async getTournamentsStaffed(
    @Path() id: number
  ): Promise<TournamentDto[]> {
    return (await this.userService.getTournamentsStaffed(id)).map(
      tournamentToDto
    );
  }

  @Get("{id}/tournament/{tournamentId}")
  @Security("loggedIn")
  public async getUserTournamentInfo(
    @Path() id: number,
    @Path() tournamentId: number
  ): Promise<PlayerTournamentInfo> {
    return await this.enrollmentService.getUserTournamentInfo(id, tournamentId);
  }

  @Get("{userId}/tournament/{tournamentId}/matches")
  @Security("loggedIn")
  public async getPlayerMatchHistory(
    @Path() userId: number,
    @Path() tournamentId: number
  ): Promise<MatchDto[]> {
    return (
      await this.matchService.getPlayerMatchHistory(userId, tournamentId)
    ).map(matchToDto);
  }

  @Post("login")
  @Response<LoginResponse>(200, "Success")
  @Response(401, "Unauthorized")
  public async login(
    @Body() credentials: { email: string; password: string }
  ): Promise<LoginResponse> {
    const token = await doLogin(credentials.email, credentials.password);
    if (!token) {
      this.setStatus(401);
      return;
    }
    return { token };
  }

  @Post("/delete/:userId")
  @Security("admin")
  public async deleteUser(@Path() userId: number) {
    return await this.userService.deleteUser(userId);
  }

  @Put("/password/:userId")
  @Security("admin")
  public async setPassword(
    @Path() userId: number,
    @Body() body: { password: string }
  ) {
    return await this.userService.setPassword(userId, body.password);
  }
}
