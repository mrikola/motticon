import { CardList } from "./Card";

export type Cube = {
  id: number;
  title: string;
  description: string;
  url: string;
  owner: string | null;
  imageUrl: string | null;
  cardlist?: CardList;
};

export type CubeSelection = {
  key: string;
  value: string;
  displayText: string;
  disabled: boolean;
};
