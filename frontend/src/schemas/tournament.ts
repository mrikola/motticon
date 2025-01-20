import { z } from "zod";
import {
  Tournament,
  Round,
  Status,
  Draft,
  DraftPod,
  DraftPodSeat,
  Match,
  PlayerTournamentScore,
} from "../types/Tournament";
import { UserSchema, PlayerSchema, EnrollmentSchema } from "./user";
import { CubeSchema } from "./cube";

export const StatusSchema: z.ZodType<Status> = z.enum([
  "pending",
  "started",
  "completed",
]);

export const DraftPodSeatSchema: z.ZodType<DraftPodSeat> = z.lazy(() =>
  z.object({
    id: z.number(),
    podId: z.number().optional(),
    pod: DraftPodSchema.optional(),
    playerId: z.number().optional(),
    player: UserSchema.nullable(),
    seat: z.number(),
    deckPhotoUrl: z.string().nullable(),
    draftPoolReturned: z.boolean(),
  }),
);

export const DraftPodSchema: z.ZodType<DraftPod> = z.lazy(() =>
  z.object({
    id: z.number(),
    draftId: z.number().optional(),
    draft: DraftSchema.optional(),
    podNumber: z.number(),
    cubeId: z.number().optional(),
    cube: CubeSchema.optional(),
    seats: z.array(DraftPodSeatSchema),
  }),
);

export const DraftSchema: z.ZodType<Draft> = z.lazy(() =>
  z.object({
    id: z.number(),
    draftNumber: z.number(),
    status: StatusSchema,
    pods: z.array(DraftPodSchema),
    firstRound: z.number(),
    lastRound: z.number(),
    startTime: z.coerce.date().optional(),
  }),
);

export const TournamentSchema: z.ZodType<Tournament> = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: StatusSchema,
  totalSeats: z.number(),
  preferencesRequired: z.number(),
  userEnrollmentEnabled: z.boolean(),
  entryFee: z.number(),
  drafts: z.array(DraftSchema),
  cubes: z.array(CubeSchema),
  staffMembers: z.array(UserSchema),
  enrollments: z.array(EnrollmentSchema),
});

export const TournamentInfoResponseSchema = z.object({
  tournament: TournamentSchema,
  enrollment: EnrollmentSchema.optional(),
});

export const MatchSchema: z.ZodType<Match> = z.object({
  id: z.number(),
  tableNumber: z.number(),
  player1GamesWon: z.number(),
  player2GamesWon: z.number(),
  player1: PlayerSchema,
  player2: PlayerSchema,
  resultSubmittedBy: PlayerSchema.optional(),
  playerGoingFirst: PlayerSchema.optional(),
});

export const RoundSchema: z.ZodType<Round> = z.object({
  id: z.number(),
  roundNumber: z.number(),
  startTime: z.coerce.date(),
  status: StatusSchema,
  matches: z.array(MatchSchema).optional(),
});

export const PlayerTournamentScoreSchema: z.ZodType<PlayerTournamentScore> =
  z.object({
    playerId: z.number().optional(),
    tournamentId: z.number().optional(),
    player: UserSchema.optional(),
    tournament: TournamentSchema.optional(),
    points: z.number(),
    draftsWon: z.number(),
    opponentMatchWinPercentage: z.number(),
  });
