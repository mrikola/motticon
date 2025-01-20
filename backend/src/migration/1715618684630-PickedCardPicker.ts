import { MigrationInterface, QueryRunner } from "typeorm";

export class PickedCardPicker1715618684630 implements MigrationInterface {
  name = "PickedCardPicker1715618684630";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "picked_card" ADD "pickerId" integer`);
    await queryRunner.query(
      `ALTER TABLE "picked_card" ADD CONSTRAINT "FK_ceec125e9ec8ec499c0d1aef82c" FOREIGN KEY ("pickerId") REFERENCES "draft_pod_seat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "picked_card" DROP CONSTRAINT "FK_ceec125e9ec8ec499c0d1aef82c"`,
    );
    await queryRunner.query(`ALTER TABLE "picked_card" DROP COLUMN "pickerId"`);
  }
}
