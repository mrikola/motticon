import { MigrationInterface, QueryRunner } from "typeorm";

export class Card1717326235025 implements MigrationInterface {
  name = "Card1717326235025";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card" ADD "manaCost" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "card" ADD "oracleText" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "card" ADD "power" integer`);
    await queryRunner.query(`ALTER TABLE "card" ADD "toughness" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "toughness"`);
    await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "power"`);
    await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "oracleText"`);
    await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "manaCost"`);
  }
}
