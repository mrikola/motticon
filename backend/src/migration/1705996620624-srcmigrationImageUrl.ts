import { MigrationInterface, QueryRunner } from "typeorm";

export class SrcmigrationImageUrl1705996620624 implements MigrationInterface {
  name = "SrcmigrationImageUrl1705996620624";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cube" ADD "imageUrl" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cube" DROP COLUMN "imageUrl"`);
  }
}
