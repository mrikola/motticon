import { CardList } from "../entity/CardList";
import { Cube } from "../entity/Cube";
import { ListedCard } from "../entity/ListedCard";
import { sumArray } from "../util/array";
import { CubeCardDto } from "./card.dto";
import { cubeAllocationToDto, TournamentCubeDto } from "./tournaments.dto";

export type CubeDto = {
  id: number;
  title: string;
  description: string;
  owner: string;
  url: string;
  imageUrl: string;
  cardlist: CardList | null;
  count?: number;
};

export type CubeDiffDto = {
  orphanedCards: ListedCard[];
  newCards: CubeCardDto[];
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
        cardlist: null, // TODO return cube.cardlist
        count: sumArray(
          cube.tournamentAllocations?.map((alloc) => alloc.count) ?? []
        ),
      }
    : undefined;
