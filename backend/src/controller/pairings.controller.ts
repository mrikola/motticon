import { DraftPod } from "../entity/DraftPod";
import { DraftPodSeat } from "../entity/DraftPodSeat";
import { Match } from "../entity/Match";
import { TournamentService } from "../service/tournament.service";
import { DraftService } from "../service/draft.service";
import { MatchService } from "../service/match.service";

const tournamentService = new TournamentService();
const draftService = new DraftService();
const matchService = new MatchService();

const winnerFrom = (match: Match) =>
  match.player1GamesWon > match.player2GamesWon
    ? match.player1Id
    : match.player2Id;
const loserFrom = (match: Match) =>
  match.player1GamesWon < match.player2GamesWon
    ? match.player1Id
    : match.player2Id;

export const generatePairings = async (
  tournamentId: number,
  round: number
): Promise<Partial<Match>[]> => {
  const draft = await tournamentService.getDraftByRoundNumber(
    tournamentId,
    round
  );

  // TODO make sure this is actually correct
  const currentRound = await tournamentService.getCurrentRound(tournamentId);
  const pods: DraftPod[] = await draftService.getPodsForDraft(draft.id);

  // TODO this only applies to 8man pod draft pairings, parametrize somehow
  // TODO test this to hell and back :D

  return (
    await Promise.all(
      pods.flatMap(async (pod): Promise<Partial<Match>[]> => {
        const seats: DraftPodSeat[] = await draftService.getSeatsForPod(pod.id);
        const players: number[] = seats.map((seat) => seat.player.id);
        const previousRoundMatches: Match[] =
          draft.roundInDraft > 1
            ? await matchService.getMatchesForRoundByPlayers(
                tournamentId,
                round - 1,
                players
              )
            : [];
        switch (draft.roundInDraft) {
          case 1:
            return [
              {
                round: currentRound,
                player1Id: seats.find((seat) => seat.seat === 1).playerId,
                player2Id: seats.find((seat) => seat.seat === 5).playerId,
                tableNumber: pod.podNumber * 4 + 1,
                matchType: "1v5",
              },
              {
                round: currentRound,
                player1Id: seats.find((seat) => seat.seat === 3).playerId,
                player2Id: seats.find((seat) => seat.seat === 7).playerId,
                tableNumber: pod.podNumber * 4 + 2,
                matchType: "3v7",
              },
              {
                round: currentRound,
                player1Id: seats.find((seat) => seat.seat === 2).playerId,
                player2Id: seats.find((seat) => seat.seat === 6).playerId,
                tableNumber: pod.podNumber * 4 + 3,
                matchType: "2v6",
              },
              {
                round: currentRound,
                player1Id: seats.find((seat) => seat.seat === 4).playerId,
                player2Id: seats.find((seat) => seat.seat === 8).playerId,
                tableNumber: pod.podNumber * 4 + 4,
                matchType: "4v8",
              },
            ];
          case 2:
            return [
              {
                round: currentRound,
                player1Id: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "1v5"
                  )
                ),
                player2Id: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "3v7"
                  )
                ),
                tableNumber: pod.podNumber * 4 + 1,
                matchType: "oddsWinners",
              },
              {
                round: currentRound,
                player1Id: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "2v6"
                  )
                ),
                player2Id: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "4v8"
                  )
                ),
                tableNumber: pod.podNumber * 4 + 2,
                matchType: "evensWinners",
              },
              {
                round: currentRound,
                player1Id: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "1v5"
                  )
                ),
                player2Id: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "3v7"
                  )
                ),
                tableNumber: pod.podNumber * 4 + 3,
                matchType: "oddsLosers",
              },
              {
                round: currentRound,
                player1Id: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "2v6"
                  )
                ),
                player2Id: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "4v8"
                  )
                ),
                tableNumber: pod.podNumber * 4 + 4,
                matchType: "evensLosers",
              },
            ];
          case 3:
            return [
              {
                round: currentRound,
                player1Id: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "oddsWinners"
                  )
                ),
                player2Id: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "evensWinners"
                  )
                ),
                tableNumber: pod.podNumber * 4 + 1,
                matchType: "final",
              },
              {
                round: currentRound,
                player1Id: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "oddsLosers"
                  )
                ),
                player2Id: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "evensLosers"
                  )
                ),
                tableNumber: pod.podNumber * 4 + 2,
                matchType: "jumbofinal",
              },
              {
                round: currentRound,
                player1Id: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "oddsLosers"
                  )
                ),
                player2Id: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "evensWinners"
                  )
                ),
                tableNumber: pod.podNumber * 4 + 3,
                matchType: "mid1",
              },
              {
                round: currentRound,
                player1Id: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "evensLosers"
                  )
                ),
                player2Id: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "oddsWinners"
                  )
                ),
                tableNumber: pod.podNumber * 4 + 4,
                matchType: "mid2",
              },
            ];
        }
      })
    )
  ).flat();
};
