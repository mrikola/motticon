import { Service, Inject } from 'typedi';
import { DataSource } from 'typeorm';
import { Match } from '../entity/Match';
import { Round } from '../entity/Round';
import { TournamentService } from './tournament.service';
import { MatchService } from './match.service';
import { MatchDto, matchToDto } from '../dto/round.dto';

@Service()
export class PairingsService {
    constructor(
        @Inject('DataSource') private appDataSource: DataSource,
        private tournamentService: TournamentService,
        private matchService: MatchService
    ) {}

    private winnerFrom (match: Match) {
      return match.player1GamesWon > match.player2GamesWon ? match.player1 : match.player2;
    }
    private loserFrom (match: Match) {
      return match.player1GamesWon < match.player2GamesWon ? match.player1 : match.player2;
    }

    async generatePairings  (
      tournamentId: number,
      draftId: number,
      roundId: number
    ): Promise<MatchDto[]> {
      // TODO this only applies to 8man pod draft pairings, parametrize somehow
      // TODO test this to hell and back :D
      // FIXME also clean this up a LOT
    
      const tournament = await this.tournamentService.getTournamentAndDrafts(
        tournamentId
      );
    
      const draft = tournament.drafts.find((draft) => draft.id === draftId);
    
      const currentRound = await this.appDataSource.getRepository(Round).findOne({
        where: { id: roundId },
      });
      const previousRound = await this.appDataSource.getRepository(Round)
        .createQueryBuilder("round")
        .where('round."tournamentId" = :tournamentId', {
          tournamentId: tournament.id,
        })
        .andWhere('round."roundNumber" = :roundNumber', {
          roundNumber: currentRound.roundNumber - 1,
        })
        .getOne();
    
      this.tournamentService.initiateRound(tournamentId, roundId);
      const { pods } = draft;
      const numberOfPods = pods.length;
    
      const roundInDraft = currentRound.roundNumber - draft.firstRound + 1;
      const matchRepo = this.appDataSource.getRepository(Match);
    
      return (
        await Promise.all(
          pods.flatMap(async (pod): Promise<Match[]> => {
            const { seats } = pod;
            const players: number[] = seats.map((seat) => seat.player.id);
            const previousRoundMatches: Match[] =
              roundInDraft > 1
                ? await this.matchService.getMatchesForRoundByPlayers(
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
                    tableNumber: pod.podNumber + numberOfPods * 0,
                    matchType: "1v5",
                  }),
                  matchRepo.create({
                    round: currentRound,
                    player1: seats.find((seat) => seat.seat === 3).player,
                    player2: seats.find((seat) => seat.seat === 7).player,
                    tableNumber: pod.podNumber + numberOfPods * 1,
                    matchType: "3v7",
                  }),
                  matchRepo.create({
                    round: currentRound,
                    player1: seats.find((seat) => seat.seat === 2).player,
                    player2: seats.find((seat) => seat.seat === 6).player,
                    tableNumber: pod.podNumber + numberOfPods * 2,
                    matchType: "2v6",
                  }),
                  matchRepo.create({
                    round: currentRound,
                    player1: seats.find((seat) => seat.seat === 4).player,
                    player2: seats.find((seat) => seat.seat === 8).player,
                    tableNumber: pod.podNumber + numberOfPods * 3,
                    matchType: "4v8",
                  }),
                ]);
              case 2:
                return await matchRepo.save([
                  matchRepo.create({
                    round: currentRound,
                    player1: this.winnerFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "1v5"
                      )
                    ),
                    player2: this.winnerFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "3v7"
                      )
                    ),
                    tableNumber: pod.podNumber + numberOfPods * 0,
                    matchType: "oddsWinners",
                  }),
                  matchRepo.create({
                    round: currentRound,
                    player1: this.winnerFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "2v6"
                      )
                    ),
                    player2: this.winnerFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "4v8"
                      )
                    ),
                    tableNumber: pod.podNumber + numberOfPods * 1,
                    matchType: "evensWinners",
                  }),
                  matchRepo.create({
                    round: currentRound,
                    player1: this.loserFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "1v5"
                      )
                    ),
                    player2: this.loserFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "3v7"
                      )
                    ),
                    tableNumber: pod.podNumber + numberOfPods * 2,
                    matchType: "oddsLosers",
                  }),
                  matchRepo.create({
                    round: currentRound,
                    player1: this.loserFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "2v6"
                      )
                    ),
                    player2: this.loserFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "4v8"
                      )
                    ),
                    tableNumber: pod.podNumber + numberOfPods * 3,
                    matchType: "evensLosers",
                  }),
                ]);
              case 3:
                return await matchRepo.save([
                  matchRepo.create({
                    round: currentRound,
                    player1: this.winnerFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "oddsWinners"
                      )
                    ),
                    player2: this.winnerFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "evensWinners"
                      )
                    ),
                    tableNumber: pod.podNumber + numberOfPods * 0,
                    matchType: "final",
                  }),
                  matchRepo.create({
                    round: currentRound,
                    player1: this.winnerFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "oddsLosers"
                      )
                    ),
                    player2: this.loserFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "evensWinners"
                      )
                    ),
                    tableNumber: pod.podNumber + numberOfPods * 1,
                    matchType: "mid1",
                  }),
                  matchRepo.create({
                    round: currentRound,
                    player1: this.winnerFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "evensLosers"
                      )
                    ),
                    player2: this.loserFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "oddsWinners"
                      )
                    ),
                    tableNumber: pod.podNumber + numberOfPods * 2,
                    matchType: "mid2",
                  }),
                  matchRepo.create({
                    round: currentRound,
                    player1: this.loserFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "oddsLosers"
                      )
                    ),
                    player2: this.loserFrom(
                      previousRoundMatches.find(
                        (match) => match.matchType === "evensLosers"
                      )
                    ),
                    tableNumber: pod.podNumber + numberOfPods * 3,
                    matchType: "jumbofinal",
                  }),
                ]);
            }
          })
        )
      )
        .flat()
        .map(matchToDto);
    };
    } 