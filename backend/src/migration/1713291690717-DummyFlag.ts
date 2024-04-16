import { MigrationInterface, QueryRunner } from "typeorm";

export class DummyFlag1713291690717 implements MigrationInterface {
    name = 'DummyFlag1713291690717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isDummy" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isDummy"`);
    }

}
