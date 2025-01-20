import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAndCube1703845465465 implements MigrationInterface {
  name = "UserAndCube1703845465465";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cube" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_0d6e986a3a692b6e4cc7e1f0881" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "cube"`);
  }
}
