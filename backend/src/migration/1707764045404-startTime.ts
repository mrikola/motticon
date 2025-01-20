import { MigrationInterface, QueryRunner } from "typeorm";

export class StartTime1707764045404 implements MigrationInterface {
  name = "StartTime1707764045404";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "draft" ADD "startTime" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "draft" DROP COLUMN "startTime"`);
  }
}
