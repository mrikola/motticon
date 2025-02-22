import { z } from "zod";
import { Cube, CubeAllocation } from "../types/Cube";
import { CardListSchema } from "./card";
import { TournamentSchema } from "./tournament";

export const CubeAllocationSchema: z.ZodType<CubeAllocation> = z.lazy(() =>
  z.object({
    tournament: TournamentSchema,
    cube: CubeSchema,
    count: z.number(),
  })
);

export const CubeSchema: z.ZodType<Cube> = z.lazy(() =>
  z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    url: z.string(),
    owner: z.string().nullable(),
    imageUrl: z.string().nullable(),
    cardlist: CardListSchema.optional().nullable(),
    count: z.number().optional(),
  })
);
