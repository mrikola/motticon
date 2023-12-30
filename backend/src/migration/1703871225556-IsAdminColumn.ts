import { MigrationInterface, QueryRunner } from "typeorm";

export class IsAdminColumn1703871225556 implements MigrationInterface {
  name = "IsAdminColumn1703871225556";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isAdmin" boolean NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAdmin"`);
  }
}
