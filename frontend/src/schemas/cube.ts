import { z } from "zod";
import { Cube } from "../types/Cube";
import { CardListSchema } from "./card";

export const CubeSchema: z.ZodType<Cube> = z.lazy(() =>
  z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    url: z.string(),
    owner: z.string().nullable(),
    imageUrl: z.string().nullable(),
    cardlist: CardListSchema.optional().nullable(),
  })
);
