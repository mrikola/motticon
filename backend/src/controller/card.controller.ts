import { Service } from 'typedi';
import { Route, Controller, Get, Post, Path, Body, Security } from 'tsoa';
import { CardService } from "../service/card.service";
import { Card, Token } from "../entity/Card";
import { ListedCard } from "../entity/ListedCard";
import { PickedCard } from "../entity/PickedCard";

@Route('card')
@Service()
export class CardController extends Controller {
    constructor(
        private cardService: CardService
    ) {
        super();
    }

    @Get('db/generate')
    @Security('admin')
    public async generateCardDb(): Promise<Card[]> {
        return await this.cardService.generateCardDb();
    }

    @Get('db')
    @Security('admin')
    public async getCardDb(): Promise<Card[]> {
        return await this.cardService.getCardDb();
    }

    @Get('db/update')
    @Security('admin')
    public async updateCardDb(): Promise<Card[]> {
        return await this.cardService.updateCardDb();
    }

    @Get('id/{scryfallId}')
    @Security('loggedIn')
    public async getCardById(@Path() scryfallId: string): Promise<Card> {
        return await this.cardService.getCardById(scryfallId);
    }

    @Get('name/{cardname}')
    @Security('loggedIn')
    public async getCardByName(@Path() cardname: string): Promise<Card> {
        return await this.cardService.getCardByName(cardname);
    }

    @Post('list')
    @Security('loggedIn')
    public async getCards(@Body() cards: string[]): Promise<Card[]> {
        return await this.cardService.getCards(cards);
    }

    @Get('tokens')
    @Security('admin')
    public async getAllTokens(): Promise<Token[]> {
        return await this.cardService.getAllTokens();
    }

    @Get('search/{query}')
    @Security('loggedIn')
    public async searchForCard(@Path() query: string): Promise<Card[]> {
        return await this.cardService.searchForCard(query);
    }

    @Get('picked')
    @Security('admin')
    public async getAllPickedCards(): Promise<PickedCard[]> {
        return await this.cardService.getAllPickedCards();
    }

    @Get('listed')
    @Security('admin')
    public async getAllListedCards(): Promise<ListedCard[]> {
        return await this.cardService.getAllListedCards();
    }

    @Get('listed/deleteOrphans')
    @Security('admin')
    public async deleteOrphanListedCards(): Promise<ListedCard[]> {
        return await this.cardService.deleteOrphanListedCards();
    }

    @Get('picked/removeAll')
    @Security('admin')
    public async removeAllPickedCards(): Promise<boolean> {
        return await this.cardService.removeAllPickedCards();
    }
}

// admin-only function to generate dummy picked cards for test users
// export const setRandomPickedCards = async (req): Promise<PickedCard[]> => {
//   const { picker } = req.body;
//   return await cardService.setRandomPickedCards(picker);
// };
