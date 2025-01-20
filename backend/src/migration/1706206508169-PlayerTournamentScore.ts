import { MigrationInterface, QueryRunner } from "typeorm";

export class PlayerTournamentScore1706206508169 implements MigrationInterface {
  name = "PlayerTournamentScore1706206508169";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "player_tournament_score" ("player_id" integer NOT NULL, "tournament_id" integer NOT NULL, "points" integer NOT NULL DEFAULT '0', "draftsWon" integer NOT NULL DEFAULT '0', "opponentMatchWinPercentage" numeric NOT NULL DEFAULT '0', CONSTRAINT "PK_cf201f77d1d3c5bd204d18588d7" PRIMARY KEY ("player_id", "tournament_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_tournament_score" ADD CONSTRAINT "FK_9eea804a2dde787d7ad9ec36139" FOREIGN KEY ("player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_tournament_score" ADD CONSTRAINT "FK_1fe834fa7d1f354cbc9b5b8b82c" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_tournament_score" DROP CONSTRAINT "FK_1fe834fa7d1f354cbc9b5b8b82c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_tournament_score" DROP CONSTRAINT "FK_9eea804a2dde787d7ad9ec36139"`,
    );
    await queryRunner.query(`DROP TABLE "player_tournament_score"`);
  }
}
