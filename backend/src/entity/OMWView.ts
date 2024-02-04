import { Index, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  expression: `
  SELECT t.*,  
  t."playerGamesWon" + t."opponentGamesWon" AS "gamesPlayed",
  CASE 
    WHEN t."playerGamesWon" > t."opponentGamesWon" THEN 3 
    WHEN t."playerGamesWon" < t."opponentGamesWon" THEN 0
    ELSE 1 
  end AS playerPoints,
  CASE 
    WHEN t."playerGamesWon" > t."opponentGamesWon" THEN 0 
    WHEN t."playerGamesWon" < t."opponentGamesWon" THEN 3
    ELSE 1 
  end AS opponentPoints
  FROM (
  SELECT e."playerId" AS playerId, t.id AS tournamentId, r."roundNumber",
  CASE WHEN M."player1Id" = e."playerId" THEN M."player2Id" ELSE M."player1Id" end AS "opponentId",
  CASE WHEN M."player1Id" = e."playerId" THEN M."player1GamesWon" ELSE M."player2GamesWon" end AS "playerGamesWon",
  CASE WHEN M."player2Id" = e."playerId" THEN M."player1GamesWon" ELSE M."player2GamesWon" end AS "opponentGamesWon"
  FROM enrollment e, tournament t, "round" r, "match" M
  WHERE e."tournamentId" = t.id AND r."tournamentId" = t.id AND M."roundId" = r.id
  AND (M."player1Id" = e."playerId" OR M."player2Id" = e."playerId")
  AND r.status = 'completed'
  ORDER BY t.id, r."roundNumber"
  ) t
`,
})
export class OMWView {
  @ViewColumn({ name: "playerid" })
  playerId: number;

  @ViewColumn({ name: "tournamentid" })
  @Index()
  tournamentId: number;

  @ViewColumn()
  roundNumber: number;

  @ViewColumn()
  opponentId: number;

  @ViewColumn()
  playerGamesWon: number;

  @ViewColumn()
  opponentGamesWon: number;

  @ViewColumn()
  gamesPlayed: number;

  @ViewColumn({ name: "playerpoints" })
  playerPoints: number;

  @ViewColumn({ name: "opponentpoints" })
  opponentPoints: number;
}
