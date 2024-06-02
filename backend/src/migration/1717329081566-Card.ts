import { MigrationInterface, QueryRunner } from "typeorm";

export class Card1717329081566 implements MigrationInterface {
    name = 'Card1717329081566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" ADD "faces" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "faces"`);
    }

}
