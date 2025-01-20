import { MigrationInterface, QueryRunner } from "typeorm";

export class CardList1715527850053 implements MigrationInterface {
  name = "CardList1715527850053";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "card" ("id" SERIAL NOT NULL, "scryfallId" character varying NOT NULL, "name" character varying NOT NULL, "set" character varying NOT NULL, CONSTRAINT "UQ_be0962616d851c5a69b69c55d9a" UNIQUE ("scryfallId"), CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "listed_card" ("id" SERIAL NOT NULL, "quantityInCube" smallint NOT NULL, "quantityInUse" smallint NOT NULL, "cardId" integer, "cardlistId" integer, CONSTRAINT "PK_d04198fce3cb037a5c88dfeda87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card_list" ("id" SERIAL NOT NULL, "cubeId" integer NOT NULL, CONSTRAINT "UQ_75007ca3a99dde1f092823de6cb" UNIQUE ("cubeId"), CONSTRAINT "PK_8cbe92f56490af05ce9bb9be12a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "cube" ADD "cardlistId" integer`);
    await queryRunner.query(
      `ALTER TABLE "listed_card" ADD CONSTRAINT "FK_a77ece0cfd5324ae33115507a5b" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listed_card" ADD CONSTRAINT "FK_1b74cd5bbda114cb35d6d6cd9e7" FOREIGN KEY ("cardlistId") REFERENCES "card_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card_list" ADD CONSTRAINT "FK_75007ca3a99dde1f092823de6cb" FOREIGN KEY ("cubeId") REFERENCES "cube"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cube" ADD CONSTRAINT "FK_1cca339cbdac74a6ec1ff988c91" FOREIGN KEY ("cardlistId") REFERENCES "card_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cube" DROP CONSTRAINT "FK_1cca339cbdac74a6ec1ff988c91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card_list" DROP CONSTRAINT "FK_75007ca3a99dde1f092823de6cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listed_card" DROP CONSTRAINT "FK_1b74cd5bbda114cb35d6d6cd9e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listed_card" DROP CONSTRAINT "FK_a77ece0cfd5324ae33115507a5b"`,
    );
    await queryRunner.query(`ALTER TABLE "cube" DROP COLUMN "cardlistId"`);
    await queryRunner.query(`DROP TABLE "card_list"`);
    await queryRunner.query(`DROP TABLE "listed_card"`);
    await queryRunner.query(`DROP TABLE "card"`);
  }
}
