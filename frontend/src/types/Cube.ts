import { DraftPodSeat } from "./Tournament";

export type Cube = {
  id: number;
  title: string;
  description: string;
  url: string;
  owner: string;
  imageUrl: string;
  cardlist: CardList;
};

export type CubeSelection = {
  key: string;
  value: string;
  displayText: string;
  disabled: boolean;
};

export type Color = "W" | "U" | "B" | "R" | "G";

export type Card = {
  id: number;
  scryfallId: string;
  name: string;
  set: string;
  cmc: number;
  colors: Color[];
  type: string;
};

export type CubeCard = {
  scryfallId: string;
  quantity: number;
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
