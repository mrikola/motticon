export type Color = "W" | "U" | "B" | "R" | "G";

export type CubeCardDto = {
  scryfallId: string;
  quantity: number;
  tokens?: TokenDto[];
};

export type TokenDto = {
  scryfallId: string;
};
