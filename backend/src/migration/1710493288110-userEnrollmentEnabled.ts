import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEnrollmentEnabled1710493288110 implements MigrationInterface {
    name = 'UserEnrollmentEnabled1710493288110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" ADD "userEnrollmentEnabled" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "userEnrollmentEnabled"`);
    }

}
