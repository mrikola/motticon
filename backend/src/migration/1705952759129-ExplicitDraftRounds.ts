import { MigrationInterface, QueryRunner } from "typeorm";

export class ExplicitDraftRounds1705952759129 implements MigrationInterface {
  name = "ExplicitDraftRounds1705952759129";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "draft" DROP COLUMN "rounds"`);
    await queryRunner.query(
      `ALTER TABLE "draft" ADD "firstRound" smallint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "draft" ADD "lastRound" smallint NOT NULL DEFAULT '3'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "draft" DROP COLUMN "lastRound"`);
    await queryRunner.query(`ALTER TABLE "draft" DROP COLUMN "firstRound"`);
    await queryRunner.query(
      `ALTER TABLE "draft" ADD "rounds" smallint NOT NULL`,
    );
  }
}
