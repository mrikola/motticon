import { Service } from 'typedi';
import { Route, Controller, Get, Post, Delete, Path, Body, Response, Security } from 'tsoa';
import {
  PlayerTournamentInfo,
  TournamentDto,
  tournamentToDto,
} from "../dto/tournaments.dto";
import {
  PlayerWithRatingDto,
  playerToRatedDto,
} from "../dto/user.dto";
import { EnrollmentService } from "../service/enrollment.service";
import { UserService } from "../service/user.service";
import { MatchService } from "../service/match.service";
import { MatchDto, matchToDto } from '../dto/round.dto';

@Route('user')
@Service()
export class UserController extends Controller {
    constructor(
        private userService: UserService,
        private enrollmentService: EnrollmentService,
        private matchService: MatchService
    ) {
        super();
    }

    @Post('signup')
    @Response(201, 'Created')
    @Response(401, 'Unauthorized')
    public async signup(@Body() user: any): Promise<void> {
        const { firstName, lastName, email, password } = user;
        const success = await this.userService.createUser(firstName, lastName, email, password);
        
        if (success) {
            this.setStatus(201); // Created
        } else {
            this.setStatus(401); // Unauthorized
        }
    }

    @Get('exists/{email}')
    public async userExists(@Path() email: string): Promise<boolean> {
        return await this.userService.userExists(email);
    }

    @Get('{id}')
    @Security('loggedIn')
    public async getUser(@Path() id: number): Promise<PlayerWithRatingDto> {
        return playerToRatedDto(await this.userService.getUser(id));
    }

    @Get('{id}/tournaments')
    @Security('loggedIn')
    public async getUsersTournaments(@Path() id: number): Promise<TournamentDto[]> {
        console.log('getUsersTournaments', id);
        return (await this.userService.getUsersTournaments(id)).map(tournamentToDto);
    }

    @Get('{id}/staff')
    @Security('loggedIn')
    public async getTournamentsStaffed(@Path() id: number): Promise<TournamentDto[]> {
        return (await this.userService.getTournamentsStaffed(id)).map(tournamentToDto);
    }

    @Get('{id}/{tournamentId}')
    @Security('loggedIn')
    public async getUserTournamentInfo(@Path() id: number, @Path() tournamentId: number): Promise<PlayerTournamentInfo> {
        return await this.enrollmentService.getUserTournamentInfo(id, tournamentId);
    }

    @Post('preferences')
    @Security('loggedIn')
    public async setCubePreferences(@Body() preferences: any): Promise<boolean> {
        return await this.userService.setCubePreferences(preferences);
    }

    @Delete('preferences')
    @Security('loggedIn')
    public async deleteCubePreferences(@Body() preferences: any): Promise<boolean> {
        return await this.userService.deleteCubePreferences(preferences);
    }

    @Get('{userId}/tournament/{tournamentId}/matches')
    @Security('loggedIn')
    public async getPlayerMatchHistory(
        @Path() userId: number,
        @Path() tournamentId: number
    ): Promise<MatchDto[]> {
        return (await this.matchService.getPlayerMatchHistory(userId, tournamentId))
            .map(matchToDto);
    }
}
