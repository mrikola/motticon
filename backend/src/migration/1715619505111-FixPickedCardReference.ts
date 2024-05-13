import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPickedCardReference1715619505111 implements MigrationInterface {
    name = 'FixPickedCardReference1715619505111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "picked_card" DROP CONSTRAINT "FK_ea5e4dea79b9ddf4265ec90dd70"`);
        await queryRunner.query(`ALTER TABLE "picked_card" DROP CONSTRAINT "FK_7ac38e0c4ac5d4637640ad8abbc"`);
        await queryRunner.query(`ALTER TABLE "listed_card" DROP CONSTRAINT "FK_0d87dbce02131b3876c0a47cc96"`);
        await queryRunner.query(`ALTER TABLE "picked_card" DROP COLUMN "cardId"`);
        await queryRunner.query(`ALTER TABLE "picked_card" DROP COLUMN "cardlistId"`);
        await queryRunner.query(`ALTER TABLE "listed_card" DROP COLUMN "pickedId"`);
        await queryRunner.query(`ALTER TABLE "picked_card" ADD "listedCardId" integer`);
        await queryRunner.query(`ALTER TABLE "picked_card" ADD CONSTRAINT "FK_424a7ceae1eb06e1b1feafeaee9" FOREIGN KEY ("listedCardId") REFERENCES "listed_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "picked_card" DROP CONSTRAINT "FK_424a7ceae1eb06e1b1feafeaee9"`);
        await queryRunner.query(`ALTER TABLE "picked_card" DROP COLUMN "listedCardId"`);
        await queryRunner.query(`ALTER TABLE "listed_card" ADD "pickedId" integer`);
        await queryRunner.query(`ALTER TABLE "picked_card" ADD "cardlistId" integer`);
        await queryRunner.query(`ALTER TABLE "picked_card" ADD "cardId" integer`);
        await queryRunner.query(`ALTER TABLE "listed_card" ADD CONSTRAINT "FK_0d87dbce02131b3876c0a47cc96" FOREIGN KEY ("pickedId") REFERENCES "picked_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "picked_card" ADD CONSTRAINT "FK_7ac38e0c4ac5d4637640ad8abbc" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "picked_card" ADD CONSTRAINT "FK_ea5e4dea79b9ddf4265ec90dd70" FOREIGN KEY ("cardlistId") REFERENCES "card_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
