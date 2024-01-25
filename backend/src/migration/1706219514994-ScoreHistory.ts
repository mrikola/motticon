import { MigrationInterface, QueryRunner } from "typeorm";

export class ScoreHistory1706219514994 implements MigrationInterface {
    name = 'ScoreHistory1706219514994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "score_history" ("id" SERIAL NOT NULL, "player_id" integer NOT NULL, "tournament_id" integer NOT NULL, "points" integer NOT NULL DEFAULT '0', "draftsWon" integer NOT NULL DEFAULT '0', "opponentMatchWinPercentage" numeric NOT NULL DEFAULT '0', "roundNumber" integer NOT NULL, CONSTRAINT "PK_4db9bfe50f50c7737fc04c2fb2a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "score_history" ADD CONSTRAINT "FK_3cf88130594c57ea83da6725e1c" FOREIGN KEY ("player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "score_history" ADD CONSTRAINT "FK_545b57b8a8efb6fc8a786abe15a" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "score_history" DROP CONSTRAINT "FK_545b57b8a8efb6fc8a786abe15a"`);
        await queryRunner.query(`ALTER TABLE "score_history" DROP CONSTRAINT "FK_3cf88130594c57ea83da6725e1c"`);
        await queryRunner.query(`DROP TABLE "score_history"`);
    }

}
