import { MigrationInterface, QueryRunner } from "typeorm";

export class WhoGoesFirst1707067974634 implements MigrationInterface {
  name = "WhoGoesFirst1707067974634";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match" ADD "playerGoingFirstId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_1d26409ba376dfc88adb7f11d0c" FOREIGN KEY ("playerGoingFirstId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_1d26409ba376dfc88adb7f11d0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP COLUMN "playerGoingFirstId"`,
    );
  }
}
