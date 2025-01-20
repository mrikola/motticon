import { MigrationInterface, QueryRunner } from "typeorm";

export class Card1717254675646 implements MigrationInterface {
  name = "Card1717254675646";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "card_tokens" ("cardId_1" integer NOT NULL, "cardId_2" integer NOT NULL, CONSTRAINT "PK_44d1a90c9725eb069564bbe50bb" PRIMARY KEY ("cardId_1", "cardId_2"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9528ac5daf833a50e8b5bedd07" ON "card_tokens" ("cardId_1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_695a1a04bae92ca08b9e85fa7f" ON "card_tokens" ("cardId_2") `,
    );
    await queryRunner.query(
      `ALTER TABLE "card_tokens" ADD CONSTRAINT "FK_9528ac5daf833a50e8b5bedd079" FOREIGN KEY ("cardId_1") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "card_tokens" ADD CONSTRAINT "FK_695a1a04bae92ca08b9e85fa7fc" FOREIGN KEY ("cardId_2") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card_tokens" DROP CONSTRAINT "FK_695a1a04bae92ca08b9e85fa7fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card_tokens" DROP CONSTRAINT "FK_9528ac5daf833a50e8b5bedd079"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_695a1a04bae92ca08b9e85fa7f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9528ac5daf833a50e8b5bedd07"`,
    );
    await queryRunner.query(`DROP TABLE "card_tokens"`);
  }
}
