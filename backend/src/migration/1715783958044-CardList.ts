import { MigrationInterface, QueryRunner } from "typeorm";

export class CardList1715783958044 implements MigrationInterface {
    name = 'CardList1715783958044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cardlist_card" ("cardListId" integer NOT NULL, "listedCardId" integer NOT NULL, CONSTRAINT "PK_163a5a4b924903f7f8b5302cafe" PRIMARY KEY ("cardListId", "listedCardId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5b939ed9fd1a893dabbdaee842" ON "cardlist_card" ("cardListId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aaf85870bcad3c2d4faaa1786a" ON "cardlist_card" ("listedCardId") `);
        await queryRunner.query(`ALTER TABLE "cardlist_card" ADD CONSTRAINT "FK_5b939ed9fd1a893dabbdaee8423" FOREIGN KEY ("cardListId") REFERENCES "card_list"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cardlist_card" ADD CONSTRAINT "FK_aaf85870bcad3c2d4faaa1786a9" FOREIGN KEY ("listedCardId") REFERENCES "listed_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cardlist_card" DROP CONSTRAINT "FK_aaf85870bcad3c2d4faaa1786a9"`);
        await queryRunner.query(`ALTER TABLE "cardlist_card" DROP CONSTRAINT "FK_5b939ed9fd1a893dabbdaee8423"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aaf85870bcad3c2d4faaa1786a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b939ed9fd1a893dabbdaee842"`);
        await queryRunner.query(`DROP TABLE "cardlist_card"`);
    }

}
