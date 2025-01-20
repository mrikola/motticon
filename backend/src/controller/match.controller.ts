import { Service } from "typedi";
import { Route, Controller, Get, Post, Path, Body, Security } from "tsoa";
import { MatchService } from "../service/match.service";
import { MatchDto, matchToDto } from "../dto/round.dto";

@Route("match")
@Service()
export class MatchController extends Controller {
  constructor(private matchService: MatchService) {
    super();
  }

  @Get("round/{roundId}")
  @Security("loggedIn")
  public async getMatchesForRound(
    @Path() roundId: number,
  ): Promise<MatchDto[]> {
    return (await this.matchService.getMatchesForRound(roundId)).map(
      matchToDto,
    );
  }

  @Post("submitResult")
  @Security("loggedIn")
  public async submitResult(
    @Body()
    result: {
      matchId: number;
      roundId: number;
      resultSubmittedBy: number;
      player1GamesWon: number;
      player2GamesWon: number;
    },
  ): Promise<MatchDto> {
    const {
      matchId,
      roundId,
      resultSubmittedBy,
      player1GamesWon,
      player2GamesWon,
    } = result;
    return matchToDto(
      await this.matchService.submitResult(
        matchId,
        roundId,
        resultSubmittedBy,
        player1GamesWon,
        player2GamesWon,
      ),
    );
  }
}
