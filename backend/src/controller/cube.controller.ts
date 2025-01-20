import { Service } from "typedi";
import { Route, Controller, Get, Post, Put, Path, Body, Security } from "tsoa";
import { CubeDiffDto, CubeDto, cubeToDto } from "../dto/cube.dto";
import { CardList } from "../entity/CardList";
import { Cube } from "../entity/Cube";
import { CubeService } from "../service/cube.service";
import { CubeCardDto } from "../dto/card.dto";
import { CardService } from "../service/card.service";

@Route("cube")
@Service()
export class CubeController extends Controller {
  constructor(
    private cubeService: CubeService,
    private cardService: CardService
  ) {
    super();
  }

  @Get()
  @Security("loggedIn")
  public async getAllCubes(): Promise<CubeDto[]> {
    return (await this.cubeService.getAllCubes()).map(cubeToDto);
  }

  @Get("{id}")
  @Security("loggedIn")
  public async getCube(@Path() id: number): Promise<CubeDto> {
    return cubeToDto(await this.cubeService.getCube(id));
  }

  @Get("tournament/{tournamentId}")
  @Security("loggedIn")
  public async getCubesForTournament(
    @Path() tournamentId: number
  ): Promise<CubeDto[]> {
    return (await this.cubeService.getCubesForTournament(tournamentId)).map(
      cubeToDto
    );
  }

  @Post("add")
  @Security("admin")
  public async addCube(
    @Body()
    cube: {
      cubecobraId: string;
      title: string;
      description: string;
      url: string;
      owner: string;
      imageUrl: string;
      cards: CubeCardDto[];
    }
  ): Promise<CubeDto> {
    const { title, description, url, owner, imageUrl, cards } = cube;
    return cubeToDto(
      await this.cubeService.addCube(
        title,
        description,
        url,
        owner,
        imageUrl,
        cards
      )
    );
  }

  @Put("edit")
  @Security("admin")
  public async editCube(
    @Body()
    cube: {
      cubeId: number;
      title: string;
      description: string;
      url: string;
      owner: string;
      imageUrl: string;
      cards: CubeCardDto[];
    }
  ): Promise<CubeDto> {
    const { cubeId, title, description, url, owner, imageUrl, cards } = cube;
    return cubeToDto(
      await this.cubeService.editCube(
        cubeId,
        title,
        description,
        url,
        owner,
        imageUrl,
        cards
      )
    );
  }

  @Put("cardlist")
  @Security("admin")
  public async updateCubeCardlist(
    @Body() update: { cubeId: number; cards: CubeCardDto[] }
  ): Promise<Cube> {
    const { cubeId, cards } = update;
    return await this.cubeService.updateCubeCards(cubeId, cards);
  }

  @Post("diff")
  @Security("admin")
  public async getCubeDiff(
    @Body() diff: { cubeId: number; cards: any[] }
  ): Promise<CubeDiffDto> {
    const { cubeId, cards } = diff;
    return await this.cubeService.getCubeDiff(cubeId, cards);
  }

  @Get("cardlist/{id}")
  @Security("admin")
  public async getCardlist(@Path() id: number): Promise<CardList> {
    return await this.cubeService.getCardlist(id);
  }

  @Get("{id}/picked/return/{seatId}")
  @Security("admin")
  public async playerReturnedCards(
    @Path() id: number,
    @Path() seatId: number
  ): Promise<boolean> {
    return await this.cardService.playerReturnedCards(seatId);
  }
}
