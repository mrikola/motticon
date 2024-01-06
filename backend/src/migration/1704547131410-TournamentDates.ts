import { MigrationInterface, QueryRunner } from "typeorm";

export class TournamentDates1704547131410 implements MigrationInterface {
  name = "TournamentDates1704547131410";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" DROP CONSTRAINT "FK_55b974f327d8b9699543848d512"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" DROP CONSTRAINT "FK_d308d98c3c9cf6a76be43c84960"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_55b974f327d8b9699543848d51"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d308d98c3c9cf6a76be43c8496"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "startDate" TIMESTAMP`
    );
    await queryRunner.query(`ALTER TABLE "tournament" ADD "endDate" TIMESTAMP`);
    await queryRunner.query(
      `CREATE INDEX "IDX_a5c96e682ffc9848537e996ce1" ON "tournament_staff_members" ("tournamentId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_841d4d6f3b1aa45ab1c516fa3d" ON "tournament_staff_members" ("userId") `
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" ADD CONSTRAINT "FK_a5c96e682ffc9848537e996ce13" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" ADD CONSTRAINT "FK_841d4d6f3b1aa45ab1c516fa3de" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" DROP CONSTRAINT "FK_841d4d6f3b1aa45ab1c516fa3de"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" DROP CONSTRAINT "FK_a5c96e682ffc9848537e996ce13"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_841d4d6f3b1aa45ab1c516fa3d"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a5c96e682ffc9848537e996ce1"`
    );
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "endDate"`);
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "startDate"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_d308d98c3c9cf6a76be43c8496" ON "tournament_staff_members" ("userId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55b974f327d8b9699543848d51" ON "tournament_staff_members" ("tournamentId") `
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" ADD CONSTRAINT "FK_d308d98c3c9cf6a76be43c84960" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" ADD CONSTRAINT "FK_55b974f327d8b9699543848d512" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }
}
