const fs = require("fs");

// use "short.json" for testing
const response = JSON.parse(fs.readFileSync("AtomicCards.json"));

let cards = [];
for (const [name, cardinfo] of Object.entries(response.data)) {
  for (const [key, info_object] of Object.entries(cardinfo)) {
    if (typeof cardinfo[key] === "object") {
      let card_obj = {
        name: info_object.name,
        scryfall_id: info_object.identifiers.scryfallOracleId,
      };
      for (const [key, value] of Object.entries(info_object.printings)) {
        var printing = { set: value };
        card_obj = { ...card_obj, ...printing };
      }
      cards.push(card_obj);
    }
  }
}

fs.writeFileSync("filtered.json", JSON.stringify(cards, null, 2));
