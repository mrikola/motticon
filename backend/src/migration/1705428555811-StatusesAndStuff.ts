import { MigrationInterface, QueryRunner } from "typeorm";

export class StatusesAndStuff1705428555811 implements MigrationInterface {
  name = "StatusesAndStuff1705428555811";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "entryFee" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "totalSeats" smallint NOT NULL DEFAULT '8'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "preferencesRequired" smallint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "status" character varying NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(`ALTER TABLE "cube" ADD "owner" character varying`);
    await queryRunner.query(
      `ALTER TABLE "draft" ADD "status" character varying NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "round" ADD "status" character varying NOT NULL DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "round" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "draft" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "cube" DROP COLUMN "owner"`);
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP COLUMN "preferencesRequired"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP COLUMN "totalSeats"`,
    );
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "entryFee"`);
  }
}
