import { MigrationInterface, QueryRunner } from "typeorm";

export class RatingDefault1705758483083 implements MigrationInterface {
    name = 'RatingDefault1705758483083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" SET DEFAULT '1600'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" DROP NOT NULL`);
    }

}
