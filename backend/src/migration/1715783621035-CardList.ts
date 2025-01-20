import { MigrationInterface, QueryRunner } from "typeorm";

export class CardList1715783621035 implements MigrationInterface {
  name = "CardList1715783621035";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "card_list_card_listed_card" ("cardListId" integer NOT NULL, "listedCardId" integer NOT NULL, CONSTRAINT "PK_27840cfa6bf36f2be160dd61e4b" PRIMARY KEY ("cardListId", "listedCardId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b45149b61380e48c0ee996921" ON "card_list_card_listed_card" ("cardListId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3ed13c8c9837314b5603991a03" ON "card_list_card_listed_card" ("listedCardId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "card_list_card_listed_card" ADD CONSTRAINT "FK_4b45149b61380e48c0ee9969211" FOREIGN KEY ("cardListId") REFERENCES "card_list"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "card_list_card_listed_card" ADD CONSTRAINT "FK_3ed13c8c9837314b5603991a031" FOREIGN KEY ("listedCardId") REFERENCES "listed_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card_list_card_listed_card" DROP CONSTRAINT "FK_3ed13c8c9837314b5603991a031"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card_list_card_listed_card" DROP CONSTRAINT "FK_4b45149b61380e48c0ee9969211"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3ed13c8c9837314b5603991a03"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b45149b61380e48c0ee996921"`,
    );
    await queryRunner.query(`DROP TABLE "card_list_card_listed_card"`);
  }
}
