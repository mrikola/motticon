const fs = require("fs");

// current script works with AllIdentifiers.json (https://mtgjson.com/downloads/all-files/#allidentifiers)
// use "short_identifiers.json" for testing
const response = JSON.parse(fs.readFileSync("AllIdentifiers.json"));

let cards = [];
for (const [key, cardinfo] of Object.entries(response.data)) {
  if (typeof response.data[key] === "object") {
    let card_obj = {
      name: cardinfo.name,
      set: cardinfo.setCode,
      scryfallId: cardinfo.identifiers.scryfallId,
    };
    cards.push(card_obj);
  }
}

cards.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync("filtered.json", JSON.stringify(cards, null, 2));
const uniqueCards = [...new Map(cards.map((v) => [v.scryfallId, v])).values()];
fs.writeFileSync("no_duplicates.json", JSON.stringify(uniqueCards, null, 2));
