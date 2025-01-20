import { MigrationInterface, QueryRunner } from "typeorm";

export class Card1715775880870 implements MigrationInterface {
  name = "Card1715775880870";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card" ALTER COLUMN "cmc" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card" ALTER COLUMN "cmc" SET NOT NULL`,
    );
  }
}
