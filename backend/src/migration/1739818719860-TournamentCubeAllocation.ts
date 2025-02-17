import { MigrationInterface, QueryRunner } from "typeorm";

export class TournamentCubeAllocation1739818719860
  implements MigrationInterface
{
  name = "TournamentCubeAllocation1739818719860";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament_cubes" DROP CONSTRAINT "FK_3c3e15954a766c429ecd7a14188"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_cubes" ADD "count" integer NOT NULL DEFAULT '1'`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_cubes" ADD CONSTRAINT "FK_3c3e15954a766c429ecd7a14188" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament_cubes" DROP CONSTRAINT "FK_3c3e15954a766c429ecd7a14188"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_cubes" DROP COLUMN "count"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_cubes" ADD CONSTRAINT "FK_3c3e15954a766c429ecd7a14188" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }
}
