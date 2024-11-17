import { z } from "zod";
import { User, Player, Enrollment } from "../types/User";
import { TournamentSchema } from "./tournament";

export const UserSchema: z.ZodType<User> = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  isAdmin: z.boolean().optional().default(false),
  rating: z.number().optional(),
  email: z.string(),
});

export const PlayerSchema: z.ZodType<Player> = UserSchema;

export const EnrollmentSchema: z.ZodType<Enrollment> = z.lazy(() => z.object({
  player: PlayerSchema.optional(),
  tournament: TournamentSchema.optional(),
  dropped: z.boolean(),
  paid: z.boolean()
})); 