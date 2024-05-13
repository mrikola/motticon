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

export type Card = {
  name: string;
  set: string;
  scryfallId: string;
};

export type ListedCard = {
  card: Card;
  cardlist: CardList;
  quantityInCube: number;
  quantityInUse: number;
};

export type CardList = {
  cubeId: number;
  cube: Cube;
  card: ListedCard[];
};
