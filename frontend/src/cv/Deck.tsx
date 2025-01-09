import { Card } from "../types/Card";

export type CardInDeck = {
  card: Card;
  quantity: number;
};

class Pile {
  cards: CardInDeck[];

  constructor() {
    this.cards = [];
  }

  addCard(card: Card): void {
    let foundMatch = false;
    const updatedCards = this.cards.map((cardInDeck) => {
      // if card is already in list, add to quantity
      if (cardInDeck.card.id === card.id) {
        cardInDeck.quantity++;
        foundMatch = true;
        return { ...cardInDeck };
      } else {
        return cardInDeck;
      }
    });
    // if no match found when iterating, add as new card
    if (!foundMatch) {
      updatedCards.push({ card, quantity: 1 });
    }
    // update the cards
    this.cards = updatedCards;
  }

  addCards(cards: Card[]): void {
    for (const c of cards) {
      this.addCard(c);
    }
  }

  getCards(): CardInDeck[] {
    return this.cards;
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
      .map((cardInDeck) => `${cardInDeck.quantity} ${cardInDeck.card.name}`)
      .join("\n");
  }

  get length(): number {
    return this.cards.reduce((n, { quantity }) => n + quantity, 0);
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

  addCard(card: Card, inSideboard: boolean): void {
    if (inSideboard) {
      this.sideboard.addCard(card);
    } else {
      this.maindeck.addCard(card);
    }
  }

  addCards(cards: Card[], inSideboard: boolean): void {
    for (const card of cards) {
      this.addCard(card, inSideboard);
    }
  }

  getMaindeck(): CardInDeck[] {
    return this.maindeck.cards;
  }

  getSideboard(): CardInDeck[] {
    return this.sideboard.cards;
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
