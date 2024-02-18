import { Cube } from "../entity/Cube";

export type CubeDto = {
  id: number;
  title: string;
  description: string;
  owner: string;
  url: string;
  imageUrl: string;
};

export const cubeToDto = (cube: Cube): CubeDto =>
  cube
    ? {
        id: cube.id,
        title: cube.title,
        description: cube.description,
        owner: cube.owner,
        url: cube.url,
        imageUrl: cube.imageUrl,
      }
    : undefined;
