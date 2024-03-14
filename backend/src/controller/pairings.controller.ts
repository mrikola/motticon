import { Match } from "../entity/Match";
import { TournamentService } from "../service/tournament.service";
import { MatchService } from "../service/match.service";
import { AppDataSource } from "../data-source";
import { Round } from "../entity/Round";
import { MatchDto, matchToDto } from "../dto/round.dto";
import { PlayerTournamentScore } from "../entity/PlayerTournamentScore";
import { ScoreService } from "../service/score.service";

const tournamentService = new TournamentService();
const matchService = new MatchService();
const scoreService = new ScoreService();

const winnerFrom = (match: Match) =>
  match.player1GamesWon > match.player2GamesWon ? match.player1 : match.player2;
const loserFrom = (match: Match) =>
  match.player1GamesWon < match.player2GamesWon ? match.player1 : match.player2;

export const generatePairings = async (
  tournamentId: number,
  draftId: number,
  roundId: number
): Promise<MatchDto[]> => {
  // TODO this only applies to 8man pod draft pairings, parametrize somehow
  // TODO test this to hell and back :D
  // FIXME also clean this up a LOT

  const tournament = await tournamentService.getTournamentAndDrafts(
    tournamentId
  );

  const draft = tournament.drafts.find((draft) => draft.id === draftId);

  const currentRound = await AppDataSource.getRepository(Round).findOne({
    where: { id: roundId },
  });
  const previousRound = await AppDataSource.getRepository(Round)
    .createQueryBuilder("round")
    .where('round."tournamentId" = :tournamentId', {
      tournamentId: tournament.id,
    })
    .andWhere('round."roundNumber" = :roundNumber', {
      roundNumber: currentRound.roundNumber - 1,
    })
    .getOne();

  tournamentService.initiateRound(tournamentId, roundId);
  const { pods } = draft;

  const roundInDraft = currentRound.roundNumber - draft.firstRound + 1;
  const matchRepo = AppDataSource.getRepository(Match);

  return (
    await Promise.all(
      pods.flatMap(async (pod): Promise<Match[]> => {
        const { seats } = pod;
        const players: number[] = seats.map((seat) => seat.player.id);
        const previousRoundMatches: Match[] =
          roundInDraft > 1
            ? await matchService.getMatchesForRoundByPlayers(
                previousRound.id,
                players
              )
            : [];
        switch (roundInDraft) {
          case 1:
            return await matchRepo.save([
              matchRepo.create({
                round: currentRound,
                player1: seats.find((seat) => seat.seat === 1).player,
                player2: seats.find((seat) => seat.seat === 5).player,
                tableNumber: (pod.podNumber - 1) * 4 + 1,
                matchType: "1v5",
              }),
              matchRepo.create({
                round: currentRound,
                player1: seats.find((seat) => seat.seat === 3).player,
                player2: seats.find((seat) => seat.seat === 7).player,
                tableNumber: (pod.podNumber - 1) * 4 + 2,
                matchType: "3v7",
              }),
              matchRepo.create({
                round: currentRound,
                player1: seats.find((seat) => seat.seat === 2).player,
                player2: seats.find((seat) => seat.seat === 6).player,
                tableNumber: (pod.podNumber - 1) * 4 + 3,
                matchType: "2v6",
              }),
              matchRepo.create({
                round: currentRound,
                player1: seats.find((seat) => seat.seat === 4).player,
                player2: seats.find((seat) => seat.seat === 8).player,
                tableNumber: (pod.podNumber - 1) * 4 + 4,
                matchType: "4v8",
              }),
            ]);
          case 2:
            return await matchRepo.save([
              matchRepo.create({
                round: currentRound,
                player1: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "1v5"
                  )
                ),
                player2: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "3v7"
                  )
                ),
                tableNumber: (pod.podNumber - 1) * 4 + 1,
                matchType: "oddsWinners",
              }),
              matchRepo.create({
                round: currentRound,
                player1: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "2v6"
                  )
                ),
                player2: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "4v8"
                  )
                ),
                tableNumber: (pod.podNumber - 1) * 4 + 2,
                matchType: "evensWinners",
              }),
              matchRepo.create({
                round: currentRound,
                player1: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "1v5"
                  )
                ),
                player2: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "3v7"
                  )
                ),
                tableNumber: (pod.podNumber - 1) * 4 + 3,
                matchType: "oddsLosers",
              }),
              matchRepo.create({
                round: currentRound,
                player1: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "2v6"
                  )
                ),
                player2: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "4v8"
                  )
                ),
                tableNumber: (pod.podNumber - 1) * 4 + 4,
                matchType: "evensLosers",
              }),
            ]);
          case 3:
            return await matchRepo.save([
              matchRepo.create({
                round: currentRound,
                player1: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "oddsWinners"
                  )
                ),
                player2: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "evensWinners"
                  )
                ),
                tableNumber: (pod.podNumber - 1) * 4 + 1,
                matchType: "final",
              }),
              matchRepo.create({
                round: currentRound,
                player1: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "oddsLosers"
                  )
                ),
                player2: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "evensLosers"
                  )
                ),
                tableNumber: (pod.podNumber - 1) * 4 + 2,
                matchType: "jumbofinal",
              }),
              matchRepo.create({
                round: currentRound,
                player1: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "oddsLosers"
                  )
                ),
                player2: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "evensWinners"
                  )
                ),
                tableNumber: (pod.podNumber - 1) * 4 + 3,
                matchType: "mid1",
              }),
              matchRepo.create({
                round: currentRound,
                player1: winnerFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "evensLosers"
                  )
                ),
                player2: loserFrom(
                  previousRoundMatches.find(
                    (match) => match.matchType === "oddsWinners"
                  )
                ),
                tableNumber: (pod.podNumber - 1) * 4 + 4,
                matchType: "mid2",
              }),
            ]);
        }
      })
    )
  )
    .flat()
    .map(matchToDto);
};

// not tested, hidden for now
// export const generateSwissPairings = async (
//   tournamentId: number,
//   draftId: number,
//   roundId: number
// ): Promise<MatchDto[]> => {
//   const tournament = await tournamentService.getTournamentAndDrafts(
//     tournamentId
//   );

//   const draft = tournament.drafts.find((draft) => draft.id === draftId);

//   const currentRound = await AppDataSource.getRepository(Round).findOne({
//     where: { id: roundId },
//   });
//   const previousRound = await AppDataSource.getRepository(Round)
//     .createQueryBuilder("round")
//     .where('round."tournamentId" = :tournamentId', {
//       tournamentId: tournament.id,
//     })
//     .andWhere('round."roundNumber" = :roundNumber', {
//       roundNumber: currentRound.roundNumber - 1,
//     })
//     .getOne();

//   tournamentService.initiateRound(tournamentId, roundId);
//   const { pods } = draft;

//   const roundInDraft = currentRound.roundNumber - draft.firstRound + 1;
//   const matchRepo = AppDataSource.getRepository(Match);
//   // get all the previous rounds as Round-objects
//   const previousRounds: Round[] = [];
//   for (let i = 1; i < roundInDraft; i++) {
//     previousRounds.push(
//       await AppDataSource.getRepository(Round)
//         .createQueryBuilder("round")
//         .where('round."tournamentId" = :tournamentId', {
//           tournamentId: tournament.id,
//         })
//         .andWhere('round."roundNumber" = :roundNumber', {
//           roundNumber: currentRound.roundNumber - i,
//         })
//         .getOne()
//     );
//   }
//   return (
//     await Promise.all(
//       pods.flatMap(async (pod): Promise<Match[]> => {
//         const { seats } = pod;
//         const previousMatches: Match[] = [];
//         // get pod players
//         const players: number[] = seats.map((seat) => seat.player.id);
//         // get previous matches
//         for (const round of previousRounds) {
//           const matches: Match[] =
//             await matchService.getMatchesForRoundByPlayers(round.id, players);
//           previousMatches.concat(matches);
//         }
//         // todo: return object
//         const newMatches: Match[] = [];
//         // get player scores as table
//         let playersByScore: PlayerTournamentScore[] = [];
//         for (const player in players) {
//           const playerScore: PlayerTournamentScore =
//             await scoreService.getPreviousScore(tournamentId, Number(player));
//           playersByScore.push(playerScore);
//         }
//         // sort table by number of points
//         playersByScore.sort((a, b) => b.points - a.points);
//         const podMatches: Match[] = [];
//         const matchesToPair = playersByScore.length / 2;
//         for (let i = 0; i < matchesToPair; i++) {
//           // pair first player
//           const player = playersByScore[0].player;
//           // get previous matches for player
//           const playerPreviousMatches = previousMatches.filter(
//             (match) =>
//               match.player1Id === player.id || match.player2Id === player.id
//           );
//           const previousOpponentIds: number[] = [];
//           // push previous opponents to table
//           for (const match of playerPreviousMatches) {
//             if (match.player1Id === player.id) {
//               previousOpponentIds.push(match.player2Id);
//             } else {
//               previousOpponentIds.push(match.player1Id);
//             }
//           }
//           // remove previous opponents
//           const eligibleOpponents = playersByScore.filter(
//             (score) =>
//               previousOpponentIds.includes(score.playerId) ||
//               score.playerId === player.id
//           );
//           const opponent = eligibleOpponents[0].player;
//           const match = Object.create({
//             round: currentRound,
//             player1: playersByScore[0].player,
//             player2: opponent,
//             tableNumber: (pod.podNumber - 1) * 4 + 3,
//             matchType: "2v6",
//           });
//           newMatches.push(match);
//           // remove the matches players from table
//           playersByScore = playersByScore.filter(function (player) {
//             player.playerId === opponent.id ||
//               player.playerId === playersByScore[0].playerId;
//           });
//         }

//         return newMatches;
//       })
//     )
//   )
//     .flat()
//     .map(matchToDto);
// };
