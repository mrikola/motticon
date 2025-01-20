import { MigrationInterface, QueryRunner } from "typeorm";

export class DraftPoolReturned1707583731030 implements MigrationInterface {
  name = "DraftPoolReturned1707583731030";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" ADD "draftPoolReturned" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" DROP COLUMN "draftPoolReturned"`,
    );
  }
}
