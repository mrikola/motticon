import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCardCountToCube1739900001000 implements MigrationInterface {
  name = "AddCardCountToCube1739900001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add cardCount column to cube table with default 360
    await queryRunner.query(
      `ALTER TABLE "cube" ADD "cardCount" integer NOT NULL DEFAULT 360`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop cardCount column from cube table
    await queryRunner.query(`ALTER TABLE "cube" DROP COLUMN "cardCount"`);
  }
}
