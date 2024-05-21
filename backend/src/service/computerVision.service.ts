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
  ): Promise<ListedCard[]> {
    const texts: string[] = await this.getTextFromUrl(photoUrl);
    const cards: ListedCard[] = await this.textsToListedCards(texts, cubeCards);
    return cards;
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

  async getTextFromUrl(url: string): Promise<string[]> {
    const features = ["Read"];
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
          lines.push(line.text);
        });
      }
      return lines;
    }
    return null;
  }

  async textsToListedCards(
    rawTexts: string[],
    cubeCards: ListedCard[]
  ): Promise<ListedCard[]> {
    const results: ListedCard[] = [];
    const symSpell = new SymSpell();
    for (const listedCard of cubeCards) {
      symSpell.add(listedCard.card.name);
    }
    // string[] dictionary of cards for symSpell search
    const dictionary = await this.listedCardsToString(cubeCards);
    for (const line of rawTexts) {
      let foundForLine = false;
      // run a symspell search for each card using a 0.5 maxRatioDiff
      const symSpellResult: string = await this.symSearch(
        symSpell,
        dictionary,
        line,
        0.5
      );
      // if something relevant is found, add it to the list of results
      if (symSpellResult) {
        // find ListedCard with card name that matches the symSpell result
        const listedCard: ListedCard = cubeCards.find((c) =>
          c.card.name.includes(symSpellResult)
        );
        results.push(listedCard);
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
          if (line.includes(name)) {
            // determine distance between card name and text line
            const distance = levenshtein(name, line);
            // add result if under cutoff point
            if (distance < 7) {
              // console.log("found intext match, distance: " + distance);
              results.push(cc);
              foundForLine = true;
              break;
            } else {
              // console.log("found, but too long match – distance: " + distance);
            }
          }
        }
      }
    }
    console.log(results.length);
    return results;
  }

  // Function for doing symSpell search() on OCR returned textx
  // @SynSpell: a SymSpell instance instantiated elsewhere
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
