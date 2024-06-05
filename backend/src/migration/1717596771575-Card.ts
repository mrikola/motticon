import { MigrationInterface, QueryRunner } from "typeorm";

export class Card1717596771575 implements MigrationInterface {
    name = 'Card1717596771575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "manaCost" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "oracleText" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "set" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "set" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "type" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "manaCost" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "oracleText" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "set" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "set" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "type" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "set" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "set" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "oracleText" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "manaCost" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "set" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "set" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "oracleText" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "manaCost" SET NOT NULL`);
    }

}
