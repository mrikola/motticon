import { Service } from 'typedi';
import { Route, Controller, Post, Body, Security } from 'tsoa';
import { ComputerVisionDto, ComputerVisionService } from "../service/computerVision.service";
import { ListedCard } from "../entity/ListedCard";

@Route('computerVision')
@Service()
export class ComputerVisionController extends Controller {
    constructor(
        private computerVisionService: ComputerVisionService
    ) {
        super();
    }

    @Post('cardsFromImageUrl')
    @Security('loggedIn')
    public async getListedCardsFromImageUrl(
        @Body() data: {
            url: string;
            cubeCards: ListedCard[];
        }
    ): Promise<ComputerVisionDto> {
        const { url, cubeCards } = data;
        return await this.computerVisionService.getListedCardsFromImageUrl(url, cubeCards);
    }

    @Post('textFromUrl')
    @Security('loggedIn')
    public async getTextFromUrl(
        @Body() data: {
            url: string;
        }
    ): Promise<ComputerVisionDto> {
        const { url } = data;
        return await this.computerVisionService.getTextFromUrl(url);
    }

    @Post('textsToCards')
    @Security('loggedIn')
    public async textsToListedCards(
        @Body() data: {
            rawTexts: ComputerVisionDto;
            dictionary: ListedCard[];
        }
    ): Promise<ComputerVisionDto> {
        const { rawTexts, dictionary } = data;
        return await this.computerVisionService.textsToListedCards(rawTexts, dictionary);
    }
}

