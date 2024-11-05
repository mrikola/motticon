import { Service, Inject } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { PlayerTournamentScore } from '../entity/PlayerTournamentScore';
import { ScoreHistory } from '../entity/ScoreHistory';
import { OMWView } from '../entity/OMWView';
import { RecordByPlayer, StandingsRow } from '../dto/score.dto';
import { UserService } from './user.service';

@Service()
export class ScoreService {
    private repository: Repository<PlayerTournamentScore>;

    constructor(
        @Inject('DataSource') private appDataSource: DataSource,
        @Inject('UserService') private userService: UserService
    ) {
        this.repository = this.appDataSource.getRepository(PlayerTournamentScore);
    }

    async getPreviousScore(
        tournamentId: number,
        playerId: number
    ): Promise<PlayerTournamentScore> {
        return await this.repository.findOne({
            where: {
                tournamentId,
                playerId,
            },
        });
    }

    async getStandings(
        tournamentId: number,
        roundNumber: number
    ): Promise<StandingsRow[]> {
        const matches = await this.appDataSource
            .getRepository(OMWView)
            .createQueryBuilder('omw')
            .where('omw.tournamentId = :tournamentId', { tournamentId })
            .andWhere('omw.roundNumber <= :roundNumber', { roundNumber })
            .orderBy('omw.roundNumber')
            .getMany();

        const tournamentScores = await this.appDataSource
            .getRepository(ScoreHistory)
            .createQueryBuilder('sh')
            .leftJoinAndSelect('sh.player', 'player')
            .where('sh.tournamentId = :tournamentId', { tournamentId })
            .andWhere('sh.roundNumber = :roundNumber', { roundNumber })
            .getMany();

        const records: RecordByPlayer = new Map();
        for (let row of matches) {
            const previousRecord = records.get(row.playerId);
            const opponentIsBye = (await this.userService.getUser(row.opponentId))
                .isDummy;
            // TODO when dropping is linked to round number, check against that
            // || (await this.enrollmentService.getEnrollment(row.opponentId,tournamentId)).dropped

            records.set(row.playerId, {
                ...previousRecord,
                id: row.playerId,
                gamesWon: (previousRecord?.gamesWon ?? 0) + row.playerGamesWon,
                gamesPlayed: (previousRecord?.gamesPlayed ?? 0) + row.gamesPlayed,
                matchPoints: (previousRecord?.matchPoints ?? 0) + row.playerPoints,
                matchesPlayed: (previousRecord?.matchesPlayed ?? 0) + 1,
                opponentIds: (previousRecord?.opponentIds ?? []).concat(
                    opponentIsBye ? [] : row.opponentId
                ),
            });

            const currentRecord = records.get(row.playerId);
            records.set(row.playerId, {
                ...currentRecord,
                matchPointPercentage: Math.max(
                    1 / 3,
                    currentRecord.matchPoints /
                        (Math.max(currentRecord.matchesPlayed, 1) * 3)
                ),
            });
        }

        const standings: StandingsRow[] = [];

        records.forEach((player) => {
            const scoreRow = tournamentScores.find(
                (score) => score.playerId === player.id
            );

            const omw =
                player.opponentIds
                    .map((id) => records.get(id).matchPointPercentage)
                    .reduce((acc, curr) => acc + curr, 0) /
                Math.max(player.opponentIds.length, 1);

            standings.push({
                playerId: scoreRow.player.id,
                firstName: scoreRow.player.firstName,
                lastName: scoreRow.player.lastName,
                matchPoints: player.matchPoints,
                draftsWon: scoreRow.draftsWon,
                opponentMatchWinPercentage: omw,
            });
        });

        return standings.sort((a, b) => {
            if (a.matchPoints === b.matchPoints) {
                if (a.draftsWon === b.draftsWon) {
                    return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
                }
                return b.draftsWon - a.draftsWon;
            }
            return b.matchPoints - a.matchPoints;
        });
    }

    async awardMatchWin(tournamentId: number, playerId: number): Promise<void> {
        const previousScore = await this.getPreviousScore(tournamentId, playerId);

        await this.repository.upsert(
            {
                tournamentId,
                playerId,
                points: (previousScore?.points ?? 0) + 3,
            },
            ['tournamentId', 'playerId']
        );
    }

    async awardDraw(
        tournamentId: number,
        player1Id: number,
        player2Id: number
    ): Promise<void> {
        const previousScore1 = await this.getPreviousScore(tournamentId, player1Id);
        const previousScore2 = await this.getPreviousScore(tournamentId, player2Id);

        await this.repository.upsert(
            {
                tournamentId,
                playerId: player1Id,
                points: (previousScore1?.points ?? 0) + 1,
            },
            ['tournamentId', 'playerId']
        );

        await this.repository.upsert(
            {
                tournamentId,
                playerId: player2Id,
                points: (previousScore2?.points ?? 0) + 1,
            },
            ['tournamentId', 'playerId']
        );
    }

    async awardDraftWin(tournamentId: number, playerId: number): Promise<void> {
        const previousScore = await this.getPreviousScore(tournamentId, playerId);

        await this.repository.upsert(
            {
                tournamentId,
                playerId,
                draftsWon: (previousScore.draftsWon ?? 0) + 1,
            },
            ['tournamentId', 'playerId']
        );
    }

    async saveSnapshot(tournamentId: number, roundNumber: number): Promise<void> {
        const scores = await this.repository.find({ where: { tournamentId } });
        this.appDataSource
            .getRepository(ScoreHistory)
            .insert(
                scores.map((score) => ({ ...score, roundNumber } as ScoreHistory))
            );
    }
}
