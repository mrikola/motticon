import { CardList } from "./Card";
import { Tournament } from "./Tournament";

export type CubeAllocation = {
  cube: Cube;
  tournament: Tournament;
  count: number;
};

export type Cube = {
  id: number;
  title: string;
  description: string;
  url: string;
  owner: string | null;
  imageUrl: string | null;
  cardlist?: CardList | null;
  count?: number;
};

export type CubeSelection = {
  key: string;
  value: string;
  displayText: string;
  disabled: boolean;
};
