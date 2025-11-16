import { MigrationInterface, QueryRunner } from "typeorm";

export class SwissPairings1739900000000 implements MigrationInterface {
  name = "SwissPairings1739900000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add pairingMode column to tournament table
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD "pairingMode" character varying NOT NULL DEFAULT 'bracket'`,
    );

    // Add podId column to match table (nullable for backward compatibility)
    await queryRunner.query(
      `ALTER TABLE "match" ADD "podId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_match_pod" FOREIGN KEY ("podId") REFERENCES "draft_pod"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Create player_pod_score table
    await queryRunner.query(
      `CREATE TABLE "player_pod_score" ("player_id" integer NOT NULL, "pod_id" integer NOT NULL, "matchPoints" integer NOT NULL DEFAULT '0', "opponentMatchWinPercentage" numeric NOT NULL DEFAULT '0', "gamesWon" integer NOT NULL DEFAULT '0', "gamesPlayed" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_player_pod_score" PRIMARY KEY ("player_id", "pod_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_pod_score" ADD CONSTRAINT "FK_player_pod_score_player" FOREIGN KEY ("player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_pod_score" ADD CONSTRAINT "FK_player_pod_score_pod" FOREIGN KEY ("pod_id") REFERENCES "draft_pod"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Create player_pod_score_history table
    await queryRunner.query(
      `CREATE TABLE "player_pod_score_history" ("id" SERIAL NOT NULL, "player_id" integer NOT NULL, "pod_id" integer NOT NULL, "round_id" integer NOT NULL, "matchPoints" integer NOT NULL DEFAULT '0', "opponentMatchWinPercentage" numeric NOT NULL DEFAULT '0', "gamesWon" integer NOT NULL DEFAULT '0', "gamesPlayed" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_player_pod_score_history" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_pod_score_history" ADD CONSTRAINT "FK_player_pod_score_history_player" FOREIGN KEY ("player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_pod_score_history" ADD CONSTRAINT "FK_player_pod_score_history_pod" FOREIGN KEY ("pod_id") REFERENCES "draft_pod"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_pod_score_history" ADD CONSTRAINT "FK_player_pod_score_history_round" FOREIGN KEY ("round_id") REFERENCES "round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop player_pod_score_history table
    await queryRunner.query(
      `ALTER TABLE "player_pod_score_history" DROP CONSTRAINT "FK_player_pod_score_history_round"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_pod_score_history" DROP CONSTRAINT "FK_player_pod_score_history_pod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_pod_score_history" DROP CONSTRAINT "FK_player_pod_score_history_player"`,
    );
    await queryRunner.query(`DROP TABLE "player_pod_score_history"`);

    // Drop player_pod_score table
    await queryRunner.query(
      `ALTER TABLE "player_pod_score" DROP CONSTRAINT "FK_player_pod_score_pod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_pod_score" DROP CONSTRAINT "FK_player_pod_score_player"`,
    );
    await queryRunner.query(`DROP TABLE "player_pod_score"`);

    // Drop podId column from match table
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_match_pod"`,
    );
    await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "podId"`);

    // Drop pairingMode column from tournament table
    await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "pairingMode"`);
  }
}

