import { z } from "zod";
import { Card, CardFace, Color, Token, CardList, ListedCard } from "../types/Card";
import { CubeSchema } from "./cube";

export const ColorSchema = z.enum(['W', 'U', 'B', 'R', 'G']) satisfies z.ZodType<Color>;

export const CardFaceSchema: z.ZodType<CardFace> = z.object({
  name: z.string(),
  manaCost: z.string(),
  oracleText: z.string(),
  colors: z.array(ColorSchema),
  power: z.number(),
  toughness: z.number(),
  imageUri: z.string()
});

const BaseCardSchema = z.object({
  id: z.number(),
  scryfallId: z.string(),
  name: z.string(),
  set: z.string(),
  cmc: z.number(),
  colors: z.array(ColorSchema),
  type: z.string(),
  manaCost: z.string(),
  oracleText: z.string(),
  power: z.number(),
  toughness: z.number(),
  faces: z.array(CardFaceSchema)
});

export let CardSchema: z.ZodType<Card> = BaseCardSchema.extend({
  tokens: z.lazy(() => z.array(TokenSchema))
});

export let TokenSchema: z.ZodType<Token> = BaseCardSchema.extend({
  tokens: z.lazy(() => z.array(TokenSchema)),
  tokenFor: z.lazy(() => z.array(CardSchema))
});

export let CardListSchema: z.ZodType<CardList> = z.lazy(() => z.object({
  cubeId: z.number(),
  cube: z.lazy(() => CubeSchema),
  cards: z.array(ListedCardSchema)
})); 

export let ListedCardSchema: z.ZodType<ListedCard> = z.lazy(() => z.object({
  card: CardSchema,
  cardlist: CardListSchema,
  pickedCards: z.array(z.any()), // TODO improve typing
  quantityInCube: z.number()
}));

