import { MigrationInterface, QueryRunner } from "typeorm";

export class Card1715774746432 implements MigrationInterface {
    name = 'Card1715774746432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "colors"`);
        await queryRunner.query(`ALTER TABLE "card" ADD "colors" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "colors"`);
        await queryRunner.query(`ALTER TABLE "card" ADD "colors" text array`);
    }

}
