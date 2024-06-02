const fs = require("fs");

// current script works with Scryfall bulk data (https://scryfall.com/docs/api/bulk-data)
const response = JSON.parse(fs.readFileSync("default-cards.json"));

let cards = [];
for (const card of response) {
  // check if card has tokens associated with it
  const tokens = [];
  if (card.all_parts && card.type_line && !card.type_line.includes("Token")) {
    for (const part of card.all_parts) {
      if (part.component === "token" && part.id !== card.id) {
        tokens.push({
          scryfallId: part.id,
          name: part.name,
          type: part.type_line,
        });
      }
    }
  }
  // check if card has several faces
  const cardFaces = [];
  if (card.card_faces) {
    for (const face of card.card_faces) {
      cardFaces.push({
        name: face.name,
        manaCost: face.mana_cost,
        oracleText: face.oracleText,
        colors: face.colors,
        power: face.power ? face.power : undefined,
        toughness: face.toughness ? face.toughness : undefined,
        imageUri: face.image_uris ? face.image_uris.normal : undefined,
      });
    }
  }

  const cmc = Number.isInteger(Number(card.cmc)) ? card.cmc : undefined;
  const power = Number.isInteger(Number(card.power)) ? card.power : undefined;
  const toughness = Number.isInteger(Number(card.toughness))
    ? card.toughness
    : undefined;
  const parts = tokens.length > 0 ? tokens : undefined;
  const faces = cardFaces.length > 0 ? cardFaces : undefined;
  const type = card.type_line ? card.type_line : "";
  const manaCost = card.mana_cost ? card.mana_cost : "";
  const oracleText = card.oracle_text ? card.oracle_text : "";

  let card_obj = {
    name: card.name,
    set: card.set,
    scryfallId: card.id,
    manaCost: manaCost,
    oracleText: oracleText,
    power: power,
    toughness: toughness,
    cmc: cmc,
    colors: card.colors,
    type: type,
    tokens: parts,
    faces: faces,
  };
  cards.push(card_obj);
}

cards.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync("filtered_scryfall.json", JSON.stringify(cards, null, 2));
const uniqueCards = [...new Map(cards.map((v) => [v.scryfallId, v])).values()];
fs.writeFileSync(
  "no_duplicates_scryfall.json",
  JSON.stringify(uniqueCards, null, 2)
);
