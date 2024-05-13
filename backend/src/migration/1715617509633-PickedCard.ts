import { MigrationInterface, QueryRunner } from "typeorm";

export class PickedCard1715617509633 implements MigrationInterface {
  name = "PickedCard1715617509633";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listed_card" RENAME COLUMN "quantityInUse" TO "pickedId"`
    );
    await queryRunner.query(
      `CREATE TABLE "picked_card" ("id" SERIAL NOT NULL, "quantityPicked" smallint NOT NULL, "cardId" integer, "cardlistId" integer, CONSTRAINT "PK_293dc44371a366a2e979ecd12f9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "listed_card" DROP COLUMN "pickedId"`);
    await queryRunner.query(`ALTER TABLE "listed_card" ADD "pickedId" integer`);
    await queryRunner.query(
      `ALTER TABLE "listed_card" ADD CONSTRAINT "FK_0d87dbce02131b3876c0a47cc96" FOREIGN KEY ("pickedId") REFERENCES "card_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "picked_card" ADD CONSTRAINT "FK_7ac38e0c4ac5d4637640ad8abbc" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "picked_card" ADD CONSTRAINT "FK_ea5e4dea79b9ddf4265ec90dd70" FOREIGN KEY ("cardlistId") REFERENCES "card_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "picked_card" DROP CONSTRAINT "FK_ea5e4dea79b9ddf4265ec90dd70"`
    );
    await queryRunner.query(
      `ALTER TABLE "picked_card" DROP CONSTRAINT "FK_7ac38e0c4ac5d4637640ad8abbc"`
    );
    await queryRunner.query(
      `ALTER TABLE "listed_card" DROP CONSTRAINT "FK_0d87dbce02131b3876c0a47cc96"`
    );
    await queryRunner.query(`ALTER TABLE "listed_card" DROP COLUMN "pickedId"`);
    await queryRunner.query(
      `ALTER TABLE "listed_card" ADD "pickedId" smallint NOT NULL`
    );
    await queryRunner.query(`DROP TABLE "picked_card"`);
    await queryRunner.query(
      `ALTER TABLE "listed_card" RENAME COLUMN "pickedId" TO "quantityInUse"`
    );
  }
}
