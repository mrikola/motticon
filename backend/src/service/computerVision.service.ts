import { DataSource } from "typeorm";
import { AppDataSource } from "../data-source";
import { Card } from "../entity/Card";
import {
  ImageAnalysisClient,
  ImageAnalysisResultOutput,
} from "@azure-rest/ai-vision-image-analysis";
import createClient from "@azure-rest/ai-vision-image-analysis";
import { AzureKeyCredential } from "@azure/core-auth";
import { SymSpell } from "mnemonist";
import { SymSpellMatch } from "mnemonist/symspell";
import levenshtein from "js-levenshtein";
import { CardService } from "./card.service";
import { ListedCard } from "../entity/ListedCard";

type Point = {
  x: number;
  y: number;
};

type ComputerVisionCard = {
  listedCard: ListedCard | undefined;
  polygon: Point[];
  text: string;
  matchFound: boolean;
  nearPolygons: number;
};

export type ComputerVisionDto = {
  imageWidth: number;
  imageHeight: number;
  cvCards: ComputerVisionCard[];
};

export class ComputerVisionService {
  private appDataSource: DataSource;
  private cardService: CardService;
  private credential: AzureKeyCredential;
  private client: ImageAnalysisClient;

  constructor() {
    this.appDataSource = AppDataSource;
    this.cardService = new CardService();
    this.credential = new AzureKeyCredential(process.env.VISION_KEY);
    this.client = createClient(process.env.VISION_ENDPOINT, this.credential);
  }

  async getListedCardsFromImageUrl(
    photoUrl: string,
    cubeCards: ListedCard[]
  ): Promise<ComputerVisionDto> {
    const cvNoListedCards: ComputerVisionDto = await this.getTextFromUrl(
      photoUrl
    );
    const cvWithCards: ComputerVisionDto = await this.textsToListedCards(
      cvNoListedCards,
      cubeCards
    );
    return cvWithCards;
  }

  async listedCardsToString(listedCards: ListedCard[]): Promise<string[]> {
    const stringCards: string[] = [];
    for (const listedCard of listedCards) {
      if (listedCard.card.name.indexOf("//") === -1) {
        stringCards.push(listedCard.card.name);
      } else {
        stringCards.push(listedCard.card.name.split(" // ")[0]);
      }
    }
    return stringCards;
  }

  async getTextFromUrl(url: string): Promise<ComputerVisionDto> {
    const features = ["Read"];
    const cvCards: ComputerVisionCard[] = [];
    // get result from Azure
    const result = await this.client.path("/imageanalysis:analyze").post({
      body: {
        url: url,
      },
      queryParameters: {
        features: features,
        language: "en",
      },
      contentType: "application/json",
    });
    if (result.body) {
      const lines: string[] = [];
      const iaResult = result.body as ImageAnalysisResultOutput;
      if (iaResult.readResult) {
        iaResult.readResult.blocks[0].lines.forEach((line) => {
          const cvCard: ComputerVisionCard = {
            listedCard: undefined,
            polygon: line.boundingPolygon,
            text: line.text,
            matchFound: false,
            nearPolygons: 0,
          };
          cvCards.push(cvCard);
        });
      }
      let width, height;
      if (iaResult.metadata) {
        width = iaResult.metadata.width;
        height = iaResult.metadata.height;
      } else {
        width = null;
        height = null;
      }
      const cvObj: ComputerVisionDto = {
        imageWidth: width,
        imageHeight: height,
        cvCards: cvCards,
      };
      return cvObj;
    }
    return null;
  }

  async textsToListedCards(
    cvdtoObj: ComputerVisionDto,
    cubeCards: ListedCard[]
  ): Promise<ComputerVisionDto> {
    const results: ComputerVisionDto[] = [];
    const symSpell = new SymSpell();
    for (const listedCard of cubeCards) {
      symSpell.add(listedCard.card.name);
    }
    // string[] dictionary of cards for symSpell search
    const dictionary = await this.listedCardsToString(cubeCards);
    for (const cvObj of cvdtoObj.cvCards) {
      let foundForLine = false;
      // run a symspell search for each card using a 0.5 maxRatioDiff
      const symSpellResult: string = await this.symSearch(
        symSpell,
        dictionary,
        cvObj.text,
        0.5
      );
      // if something relevant is found, add it to the list of results
      if (symSpellResult) {
        // find ListedCard with card name that matches the symSpell result
        const listedCard: ListedCard = cubeCards.find((c) =>
          c.card.name.includes(symSpellResult)
        );
        cvObj.listedCard = listedCard;
        cvObj.matchFound = true;
        // results.push(listedCard);
        foundForLine = true;
      } else {
        // console.log("symspell search did not find match");
      }
      // if no card found for line of text, try looking for direct match within string
      if (!foundForLine) {
        for (const cc of cubeCards) {
          // Card-object has full "foo // bar" name for complex card, but lines of text will not.
          // Split by the "//" separator and assign name-value based on outcome
          let name: string = "";
          if (cc.card.name.indexOf("//") === -1) {
            name = cc.card.name;
          } else {
            name = cc.card.name.split(" // ")[0];
          }
          if (cvObj.text.includes(name)) {
            // determine distance between card name and text line
            const distance = levenshtein(name, cvObj.text);
            // add result if under cutoff point
            if (distance < 7) {
              // console.log("found intext match, distance: " + distance);
              cvObj.listedCard = cc;
              cvObj.matchFound = true;
              // results.push(cc);
              foundForLine = true;
              break;
            } else {
              // console.log("found, but too long match – distance: " + distance);
            }
          }
        }
      }
    }
    return cvdtoObj;
  }

  // Function for doing symSpell search() on OCR returned textx
  // @s ymSpell: a SymSpell instance instantiated elsewhere
  // @cards: a dictionary of cards to search against (have been added to SymSpell elsewhere already)
  // @text: piece of text to search for
  // @maxRatioDiff: default to use is 0.5
  async symSearch(
    symSpell: SymSpell,
    cards: string[],
    text: string,
    maxRatioDiff: number
  ): Promise<string> {
    // card names can not be this short
    if (text.length < 3) {
      //console.log("too short");
      return null;
    }
    // card names can not be this long
    if (text.length > 40) {
      //console.log(`Too long: ${text}`);
      return null;
    }
    // see if it can be found directly in card list
    if (cards.includes(text)) {
      //console.log("Found " + text + " directly in card list");
      return text;
    }
    const i = text.indexOf("..");
    if (i !== -1) {
      let dist = maxRatioDiff * i;
      let card = null;
      const t = text.substring(0, i);
      for (const c of cards) {
        // levenshtein compare function to measure distance between strings
        const d = levenshtein(t, c.substring(0, i));
        if (d !== -1 && d < dist) {
          card = c;
          dist = d;
        }
      }
      if (card === null) {
        //console.log(`Not prefix: ${text}`);
      } else {
        //console.log(`Found prefix: ${text} ${dist / i} ${card}`);
        return card;
      }
    } else {
      const suggestion = symSpell.search(text);
      if (suggestion.length !== 0) {
        const card = suggestion[0].term;
        const ratio = suggestion[0].distance / text.length;
        if (text.length < card.length + 7) {
          //console.log(`Corrected: ${text} ${ratio} ${card}`);
          return card;
        }
        //console.log(`Not corrected (too long): ${text} ${ratio} ${card}`);
      } else {
        //console.log(`Not found: ${text}`);
      }
    }
    return null;
  }
}
