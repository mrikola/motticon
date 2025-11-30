import { User, Player, Enrollment } from "../types/User";
import { Match, DraftPodSeat, Draft, Round } from "../types/Tournament";

/**
 * Sort users/players by lastName, then firstName (alphabetical)
 */
export function sortByLastNameFirstName<
  T extends { lastName: string; firstName: string }
>(a: T, b: T): number {
  const lastNameCompare = a.lastName.localeCompare(b.lastName);
  return lastNameCompare !== 0
    ? lastNameCompare
    : a.firstName.localeCompare(b.firstName);
}

/**
 * Sort users/players by lastName, then firstName (alphabetical)
 * Handles nullable player fields for Enrollment types
 */
export function sortEnrollmentsByLastNameFirstName(
  a: Enrollment,
  b: Enrollment
): number {
  const lastNameA = a.player?.lastName ?? "";
  const lastNameB = b.player?.lastName ?? "";
  const lastNameCompare = lastNameA.localeCompare(lastNameB);
  if (lastNameCompare !== 0) return lastNameCompare;
  const firstNameA = a.player?.firstName ?? "";
  const firstNameB = b.player?.firstName ?? "";
  return firstNameA.localeCompare(firstNameB);
}

/**
 * Sort matches by round number (ascending), then by table number
 */
export function sortMatchesByRoundThenTable(a: Match, b: Match): number {
  const roundA = a.round?.roundNumber ?? 0;
  const roundB = b.round?.roundNumber ?? 0;
  if (roundA !== roundB) return roundA - roundB;
  return a.tableNumber - b.tableNumber;
}

/**
 * Sort matches by table number (ascending)
 */
export function sortMatchesByTable(a: Match, b: Match): number {
  return a.tableNumber - b.tableNumber;
}

/**
 * Sort draft pod seats by pod number, then by seat number
 */
export function sortSeatsByPodThenSeat(
  a: DraftPodSeat,
  b: DraftPodSeat
): number {
  const podCompare = (a.pod?.podNumber ?? 0) - (b.pod?.podNumber ?? 0);
  if (podCompare !== 0) return podCompare;
  return (a.seat ?? 0) - (b.seat ?? 0);
}

/**
 * Sort draft pod seats by seat number (ascending)
 */
export function sortSeatsBySeat(a: DraftPodSeat, b: DraftPodSeat): number {
  return (a.seat ?? 0) - (b.seat ?? 0);
}

/**
 * Sort drafts by draft number (ascending)
 */
export function sortDraftsByDraftNumber(a: Draft, b: Draft): number {
  return a.draftNumber - b.draftNumber;
}

/**
 * Sort rounds by round number (ascending)
 */
export function sortRoundsByRoundNumber(a: Round, b: Round): number {
  return a.roundNumber - b.roundNumber;
}

/**
 * Sort matches by round number only (ascending)
 * Use sortMatchesByRoundThenTable if you also want table sorting
 */
export function sortMatchesByRound(a: Match, b: Match): number {
  const roundA = a.round?.roundNumber ?? 0;
  const roundB = b.round?.roundNumber ?? 0;
  return roundA - roundB;
}
