import { Cube } from "./Cube";
import { DraftPodSeat } from "./Tournament";

export type Color = "W" | "U" | "B" | "R" | "G";

export type Card = {
  id: number;
  scryfallId: string;
  name: string;
  set: string;
  cmc: number;
  colors: Color[];
  type: string;
  tokens: Token[];
  manaCost: string;
  oracleText: string;
  power: number;
  toughness: number;
  faces: CardFace[];
};

export type Token = Card & { tokenFor: Card[] };

export type CardFace = {
  name: string;
  manaCost: string;
  oracleText: string;
  colors: Color[];
  power: number;
  toughness: number;
  imageUri: string;
};

export type CubeCard = {
  scryfallId: string;
  quantity: number;
};

export type TokenSimple = {
  scryfallId: string;
};

export type ListedCard = {
  card: Card;
  cardlist: CardList;
  pickedCards: PickedCard[];
  quantityInCube: number;
};

export type PickedCard = {
  listedCard: ListedCard;
  quantityPicked: number;
  picker: DraftPodSeat;
};

export type CardList = {
  cubeId: number;
  cube: Cube;
  cards: ListedCard[];
};

export type CardAndQuantity = {
  listedCard: ListedCard;
  quantityPicked: number;
};

type Point = {
  x: number;
  y: number;
};

type ComputerVisionCard = {
  listedCard: ListedCard | undefined;
  polygon: Point[];
  text: string;
  matchFound: boolean;
};

export type ComputerVisionDto = {
  imageWidth: number;
  imageHeight: number;
  cvCards: ComputerVisionCard[];
};
