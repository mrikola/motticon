import { MigrationInterface, QueryRunner } from "typeorm";

export class MatchType1705269697174 implements MigrationInterface {
  name = "MatchType1705269697174";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match" ADD "matchType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "player1GamesWon" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "player2GamesWon" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" DROP CONSTRAINT "FK_3fb2d50210c020e6859f97d141a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" DROP CONSTRAINT "REL_3fb2d50210c020e6859f97d141"`,
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" ADD CONSTRAINT "FK_3fb2d50210c020e6859f97d141a" FOREIGN KEY ("playerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" DROP CONSTRAINT "FK_3fb2d50210c020e6859f97d141a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" ADD CONSTRAINT "REL_3fb2d50210c020e6859f97d141" UNIQUE ("playerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" ADD CONSTRAINT "FK_3fb2d50210c020e6859f97d141a" FOREIGN KEY ("playerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "player2GamesWon" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ALTER COLUMN "player1GamesWon" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "matchType"`);
  }
}
