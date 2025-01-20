import { MigrationInterface, QueryRunner } from "typeorm";

export class OMWView1707085279659 implements MigrationInterface {
  name = "OMWView1707085279659";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE VIEW "omw_view" AS 
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
`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        "public",
        "VIEW",
        "omw_view",
        'SELECT t.*,  \n  t."playerGamesWon" + t."opponentGamesWon" AS "gamesPlayed",\n  CASE \n    WHEN t."playerGamesWon" > t."opponentGamesWon" THEN 3 \n    WHEN t."playerGamesWon" < t."opponentGamesWon" THEN 0\n    ELSE 1 \n  end AS playerPoints,\n  CASE \n    WHEN t."playerGamesWon" > t."opponentGamesWon" THEN 0 \n    WHEN t."playerGamesWon" < t."opponentGamesWon" THEN 3\n    ELSE 1 \n  end AS opponentPoints\n  FROM (\n  SELECT e."playerId" AS playerId, t.id AS tournamentId, r."roundNumber",\n  CASE WHEN M."player1Id" = e."playerId" THEN M."player2Id" ELSE M."player1Id" end AS "opponentId",\n  CASE WHEN M."player1Id" = e."playerId" THEN M."player1GamesWon" ELSE M."player2GamesWon" end AS "playerGamesWon",\n  CASE WHEN M."player2Id" = e."playerId" THEN M."player1GamesWon" ELSE M."player2GamesWon" end AS "opponentGamesWon"\n  FROM enrollment e, tournament t, "round" r, "match" M\n  WHERE e."tournamentId" = t.id AND r."tournamentId" = t.id AND M."roundId" = r.id\n  AND (M."player1Id" = e."playerId" OR M."player2Id" = e."playerId")\n  AND r.status = \'completed\'\n  ORDER BY t.id, r."roundNumber"\n  ) t',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ["VIEW", "omw_view", "public"],
    );
    await queryRunner.query(`DROP VIEW "omw_view"`);
  }
}
