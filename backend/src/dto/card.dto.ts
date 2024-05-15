export type Color = "W" | "U" | "B" | "R" | "G";

export type SimpleCard = {
  name: string;
  set: string;
  scryfallId: string;
};

export type CubeCardDto = {
  name: string;
  set: string;
  scryfallId: string;
  cmc: number;
  colors: Color[];
  type: string;
  quantity: number;
};
