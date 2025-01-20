import { MigrationInterface, QueryRunner } from "typeorm";

export class SrcmigrationCard1715693560459 implements MigrationInterface {
  name = "SrcmigrationCard1715693560459";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "card" ADD "cmc" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "card" ADD "colors" text array`);
    await queryRunner.query(
      `ALTER TABLE "card" ADD "type" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "colors"`);
    await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "cmc"`);
  }
}
