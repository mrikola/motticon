import { MigrationInterface, QueryRunner } from "typeorm";

export class Card1717596507488 implements MigrationInterface {
    name = 'Card1717596507488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "manaCost" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "oracleText" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "manaCost" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "oracleText" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "oracleText" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "manaCost" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "oracleText" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "manaCost" DROP DEFAULT`);
    }

}
