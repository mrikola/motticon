import { MigrationInterface, QueryRunner } from "typeorm";

export class TournamentCubes1704633269022 implements MigrationInterface {
  name = "TournamentCubes1704633269022";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" DROP CONSTRAINT "FK_841d4d6f3b1aa45ab1c516fa3de"`,
    );
    await queryRunner.query(
      `CREATE TABLE "tournament_cubes" ("tournamentId" integer NOT NULL, "cubeId" integer NOT NULL, CONSTRAINT "PK_b74e0dec6cb78de7edff7a6be02" PRIMARY KEY ("tournamentId", "cubeId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3c3e15954a766c429ecd7a1418" ON "tournament_cubes" ("tournamentId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d80b42e4029c7fb5b9d6974ab" ON "tournament_cubes" ("cubeId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_cubes" ADD CONSTRAINT "FK_3c3e15954a766c429ecd7a14188" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_cubes" ADD CONSTRAINT "FK_3d80b42e4029c7fb5b9d6974ab7" FOREIGN KEY ("cubeId") REFERENCES "cube"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" ADD CONSTRAINT "FK_841d4d6f3b1aa45ab1c516fa3de" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" DROP CONSTRAINT "FK_841d4d6f3b1aa45ab1c516fa3de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_cubes" DROP CONSTRAINT "FK_3d80b42e4029c7fb5b9d6974ab7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_cubes" DROP CONSTRAINT "FK_3c3e15954a766c429ecd7a14188"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d80b42e4029c7fb5b9d6974ab"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3c3e15954a766c429ecd7a1418"`,
    );
    await queryRunner.query(`DROP TABLE "tournament_cubes"`);
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" ADD CONSTRAINT "FK_841d4d6f3b1aa45ab1c516fa3de" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
