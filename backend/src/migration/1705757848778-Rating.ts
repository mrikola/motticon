import { MigrationInterface, QueryRunner } from "typeorm";

export class Rating1705757848778 implements MigrationInterface {
    name = 'Rating1705757848778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "rating" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "draft_pod" DROP CONSTRAINT "FK_edee8f335fe232f99d316a59085"`);
        await queryRunner.query(`ALTER TABLE "draft_pod" DROP CONSTRAINT "REL_edee8f335fe232f99d316a5908"`);
        await queryRunner.query(`ALTER TABLE "draft_pod" ADD CONSTRAINT "FK_edee8f335fe232f99d316a59085" FOREIGN KEY ("cubeId") REFERENCES "cube"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "draft_pod" DROP CONSTRAINT "FK_edee8f335fe232f99d316a59085"`);
        await queryRunner.query(`ALTER TABLE "draft_pod" ADD CONSTRAINT "REL_edee8f335fe232f99d316a5908" UNIQUE ("cubeId")`);
        await queryRunner.query(`ALTER TABLE "draft_pod" ADD CONSTRAINT "FK_edee8f335fe232f99d316a59085" FOREIGN KEY ("cubeId") REFERENCES "cube"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "rating"`);
    }

}
