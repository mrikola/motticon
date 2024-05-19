import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import cards from "../cards_no_duplicates.json";
import { Color } from "../dto/card.dto";
import { Card } from "../entity/Card";
const cardsArray = cards as Card[];
import {
  ImageAnalysisClient,
  ImageAnalysisResultOutput,
} from "@azure-rest/ai-vision-image-analysis";
import createClient from "@azure-rest/ai-vision-image-analysis";
import { AzureKeyCredential } from "@azure/core-auth";
import { SymSpell } from "mnemonist";
import { SymSpellMatch } from "mnemonist/symspell";
import levenshtein from "js-levenshtein";

export class ComputerVisionService {
  private appDataSource: DataSource;
  private credential: AzureKeyCredential;
  private client: ImageAnalysisClient;

  constructor() {
    this.appDataSource = AppDataSource;
    this.credential = new AzureKeyCredential(process.env.VISION_KEY);
    this.client = createClient(process.env.VISION_ENDPOINT, this.credential);
  }

  async getCardsFromImageUrl(
    url: string,
    dictionary: string[]
  ): Promise<string[]> {
    const texts = await this.getTextFromUrl(url);
    const cards = await this.textsToMagicCards(texts, dictionary);
    return cards;
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

  async textsToMagicCards(
    rawTexts: string[],
    dictionary: string[]
  ): Promise<string[]> {
    const results = [];
    const symSpell = new SymSpell();
    for (const card of dictionary) {
      symSpell.add(card);
    }
    for (const line of rawTexts) {
      // run a symspell search for each card using a 0.5 maxRatioDiff
      const card = await this.symSearch(symSpell, dictionary, line, 0.5);
      // if something relevant is found, add it to the list of results
      if (card) {
        results.push(card);
      }
    }
    return results;
  }

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
    if (text.length > 30) {
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
      // console.log("t: " + t);
      for (const c of cards) {
        // levenshtein compare function from additional package
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
      // should use different max edit distance here, per: max_edit_distance=min(6, int(self.max_ratio_diff * len(text))
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
