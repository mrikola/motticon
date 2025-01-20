import { MigrationInterface, QueryRunner } from "typeorm";

export class PickedCard1717167424679 implements MigrationInterface {
  name = "PickedCard1717167424679";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "picked_card" DROP CONSTRAINT "FK_424a7ceae1eb06e1b1feafeaee9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listed_card" DROP CONSTRAINT "FK_a77ece0cfd5324ae33115507a5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "picked_card" ADD CONSTRAINT "FK_424a7ceae1eb06e1b1feafeaee9" FOREIGN KEY ("listedCardId") REFERENCES "listed_card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listed_card" ADD CONSTRAINT "FK_a77ece0cfd5324ae33115507a5b" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listed_card" DROP CONSTRAINT "FK_a77ece0cfd5324ae33115507a5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "picked_card" DROP CONSTRAINT "FK_424a7ceae1eb06e1b1feafeaee9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listed_card" ADD CONSTRAINT "FK_a77ece0cfd5324ae33115507a5b" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "picked_card" ADD CONSTRAINT "FK_424a7ceae1eb06e1b1feafeaee9" FOREIGN KEY ("listedCardId") REFERENCES "listed_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
