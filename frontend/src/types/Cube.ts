export type Cube = {
  id: number;
  title: string;
  description: string;
  url: string;
  owner: string;
  imageUrl: string;
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
