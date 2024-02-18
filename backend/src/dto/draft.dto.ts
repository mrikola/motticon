import { Draft } from "../entity/Draft";
import { DraftPod } from "../entity/DraftPod";
import { DraftPodSeat } from "../entity/DraftPodSeat";
import { CubeDto, cubeToDto } from "./cube.dto";
import { DraftStatus } from "./general.dto";
import { PlayerDto, playerToDto } from "./user.dto";

export type PodDraftMatch =
  | "1v5"
  | "2v6"
  | "3v7"
  | "4v8"
  | "oddsWinners"
  | "oddsLosers"
  | "evensWinners"
  | "evensLosers"
  | "final"
  | "jumbofinal"
  | "mid1"
  | "mid2";

export type DraftPodSeatDto = {
  id: number;
  seat: number;
  player: PlayerDto;
  deckPhotoUrl: string;
  draftPoolReturned: boolean;
};

export type DraftPodDto = {
  id: number;
  podNumber: number;
  cube?: CubeDto;
  seats?: DraftPodSeatDto[];
};

export type DraftDto = {
  id: number;
  draftNumber: number;
  firstRound: number;
  lastRound: number;
  status: DraftStatus;
  startTime: Date;
  pods?: DraftPodDto[];
};

export const seatToDto = (seat: DraftPodSeat): DraftPodSeatDto => ({
  id: seat.id,
  seat: seat.seat,
  player: playerToDto(seat.player),
  deckPhotoUrl: seat.deckPhotoUrl,
  draftPoolReturned: seat.draftPoolReturned,
});

export const podToDto = (pod: DraftPod): DraftPodDto => ({
  id: pod.id,
  podNumber: pod.podNumber,
  cube: pod.cube ? cubeToDto(pod.cube) : undefined,
  seats: pod.seats?.map(seatToDto),
});

export const draftToDto = (draft: Draft): DraftDto => ({
  id: draft.id,
  draftNumber: draft.draftNumber,
  firstRound: draft.firstRound,
  lastRound: draft.lastRound,
  status: draft.status,
  startTime: new Date(draft.startTime.toNumber()),
  pods: draft.pods?.map(podToDto),
});
