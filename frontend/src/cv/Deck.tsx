// import * as logging from 'winston';
// import { Counter } from 'collections';
// import { dataclass, field } from 'dataclass-transformer';
// import { Path } from 'path';
// import { Iterable } from 'typescript';

// import { Card } from "../types/Cube";

export type CardInDeck = {
  cardname: string;
  quantity: number;
};

class Pile {
  cards: CardInDeck[];

  constructor() {
    this.cards = [];
  }

  addCard(cardname: string): void {
    let foundMatch = false;
    const updatedCards = this.cards.map((card) => {
      // if card is already in list, add to quantity
      if (card.cardname === cardname) {
        card.quantity++;
        // console.log(card.cardname + " qty: " + card.quantity++);
        foundMatch = true;
        return { ...card };
      } else {
        return card;
      }
    });
    // if no match found when iterating, add as new card
    if (!foundMatch) {
      updatedCards.push({ cardname, quantity: 1 });
    }
    // update the cards
    this.cards = updatedCards;
    // if (this.cards.some((c) => c.cardname === cardname)) {
    //   this.cards.set(card, this.cards.get(card)! + 1);
    // } else {
    //   this.cards.push({cardname, 1})
    // }
  }

  addCards(cards: string[]): void {
    for (const c of cards) {
      this.addCard(c);
    }
  }

  // diff(other: Pile): number {
  //   let res = 0;
  //   for (const card of this.cards.keys()) {
  //     const n = this.cards.get(card)!;
  //     let p = 0;
  //     if (other.cards.has(card)) {
  //       p = other.cards.get(card)!;
  //     }
  //     const d = n - p;
  //     if (d > 0) {
  //       console.log(`Diff ${card}: ${p} instead of ${n}`);
  //       res += d;
  //     }
  //   }
  //   for (const card of other.cards.keys()) {
  //     const n = other.cards.get(card)!;
  //     let p = 0;
  //     if (this.cards.has(card)) {
  //       p = this.cards.get(card)!;
  //     }
  //     const d = n - p;
  //     if (d > 0) {
  //       console.log(`Diff ${card}: ${n} instead of ${p}`);
  //       res += d;
  //     }
  //   }
  //   return res;
  // }

  // [Symbol.iterator](): IterableIterator<[string, number]> {
  //   return this.cards.entries();
  // }

  toString(): string {
    return this.cards
      .map((card) => `${card.quantity} ${card.cardname}`)
      .join("\n");
  }

  get length(): number {
    return this.cards.reduce((n, { quantity }) => n + quantity, 0);
    // return [...this.cards].reduce((sum, [_, count]) => sum + count, 0);
  }
}

export class Deck {
  maindeck: Pile;
  sideboard: Pile;

  constructor(maindeck: Pile = new Pile(), sideboard: Pile = new Pile()) {
    this.maindeck = maindeck;
    this.sideboard = sideboard;
  }

  toString(): string {
    if (this.sideboard.length === 0) {
      return this.maindeck.toString();
    }
    return `${this.maindeck}\n${this.sideboard}`;
  }

  get length(): number {
    return this.maindeck.length + this.sideboard.length;
  }

  // [Symbol.iterator](): IterableIterator<[string, number]> {
  //   return [...this.maindeck, ...this.sideboard][Symbol.iterator]();
  // }

  addCard(card: string, inSideboard: boolean): void {
    if (inSideboard) {
      this.sideboard.addCard(card);
    } else {
      this.maindeck.addCard(card);
    }
  }

  addCards(cards: Iterable<string>, inSideboard: boolean): void {
    for (const card of cards) {
      this.addCard(card, inSideboard);
    }
  }

  // save(file: string): void {
  //   console.log(`Saving ${file}`);
  //   Path.writeFile(file, this.toString());
  // }

  // static load(file: string): Deck {
  //   console.log(`Loading ${file}`);
  //   const filePath = Path.resolve(file);
  //   const deck = new Deck();
  //   if (!Path.existsSync(filePath)) {
  //     console.log(`Can't load file ${file}`);
  //     return deck;
  //   }
  //   const contents = Path.readFileSync(filePath, "utf8");
  //   let inSideboard = false;
  //   for (const line of contents.split("\n")) {
  //     if (line === "") {
  //       inSideboard = true;
  //     } else {
  //       try {
  //         const [countStr, card] = line.split(" ");
  //         const count = parseInt(countStr);
  //         deck.addCards([card], inSideboard);
  //       } catch (e) {
  //         console.log(`Can't read ${line}`);
  //       }
  //     }
  //   }
  //   return deck;
  // }

  // diff(other: Deck): number {
  //   return (
  //     this.maindeck.diff(other.maindeck) + this.sideboard.diff(other.sideboard)
  //   );
  // }
}
