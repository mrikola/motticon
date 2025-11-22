import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceCardCountWithMaxPlayersSupported1763471646960
  implements MigrationInterface
{
  name = "ReplaceCardCountWithMaxPlayersSupported1763471646960";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add maxPlayersSupported column with default 8
    await queryRunner.query(
      `ALTER TABLE "cube" ADD "maxPlayersSupported" integer NOT NULL DEFAULT 8`
    );

    // Migrate existing data: if cardCount >= 450, set maxPlayersSupported to 10, otherwise 8
    await queryRunner.query(`
      UPDATE "cube" 
      SET "maxPlayersSupported" = CASE 
        WHEN "cardCount" >= 450 THEN 10 
        ELSE 8 
      END
    `);

    // Drop cardCount column
    await queryRunner.query(`ALTER TABLE "cube" DROP COLUMN "cardCount"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add cardCount column back with default 360
    await queryRunner.query(
      `ALTER TABLE "cube" ADD "cardCount" integer NOT NULL DEFAULT 360`
    );

    // Migrate existing data: if maxPlayersSupported >= 10, set cardCount to 450, otherwise 360
    await queryRunner.query(`
      UPDATE "cube" 
      SET "cardCount" = CASE 
        WHEN "maxPlayersSupported" >= 10 THEN 450 
        ELSE 360 
      END
    `);

    // Drop maxPlayersSupported column
    await queryRunner.query(
      `ALTER TABLE "cube" DROP COLUMN "maxPlayersSupported"`
    );
  }
}
