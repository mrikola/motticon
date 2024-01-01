import { MigrationInterface, QueryRunner } from "typeorm";

export class OtherEntities1703972096155 implements MigrationInterface {
  name = "OtherEntities1703972096155";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "enrollment" ("id" SERIAL NOT NULL, "paid" boolean NOT NULL, "dropped" boolean NOT NULL, "tournamentId" integer, "playerId" integer, CONSTRAINT "PK_7e200c699fa93865cdcdd025885" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tournament" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_449f912ba2b62be003f0c22e767" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "draft" ("id" SERIAL NOT NULL, "draftNumber" smallint NOT NULL, "rounds" smallint NOT NULL, "tournamentId" integer, CONSTRAINT "UQ_04f5c8c6c3daba2af5e067645ed" UNIQUE ("tournamentId", "draftNumber"), CONSTRAINT "REL_c418ae417192fa54df01de6e07" UNIQUE ("tournamentId"), CONSTRAINT "PK_0b2b03d3f2c998450423648bc65" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "draft_pod" ("id" SERIAL NOT NULL, "podNumber" smallint NOT NULL, "draftId" integer, "cubeId" integer, CONSTRAINT "UQ_220deffcb1558549e24c5707496" UNIQUE ("draftId", "podNumber"), CONSTRAINT "REL_edee8f335fe232f99d316a5908" UNIQUE ("cubeId"), CONSTRAINT "PK_afd3b26e8af73a800e53c07ad77" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "draft_pod_seat" ("id" SERIAL NOT NULL, "seat" smallint NOT NULL, "deckPhotoUrl" character varying, "podId" integer, "playerId" integer, CONSTRAINT "REL_3fb2d50210c020e6859f97d141" UNIQUE ("playerId"), CONSTRAINT "PK_caa07bff36565d3c45a10ce0527" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "match" ("id" SERIAL NOT NULL, "tableNumber" smallint NOT NULL, "player1GamesWon" smallint NOT NULL, "player2GamesWon" smallint NOT NULL, "roundId" integer, "player1Id" integer, "player2Id" integer, "resultSubmittedById" integer, CONSTRAINT "REL_7ecd38eb2baa65327de8fc6021" UNIQUE ("player1Id"), CONSTRAINT "REL_d1f05e5fc2a7f92e29c8e3c8e0" UNIQUE ("player2Id"), CONSTRAINT "REL_bdf6b29b954510a783f3931eb9" UNIQUE ("resultSubmittedById"), CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "round" ("id" SERIAL NOT NULL, "roundNumber" smallint NOT NULL, "startTime" TIMESTAMP, "tournamentId" integer, CONSTRAINT "REL_a019f16925812eb8b9cd5ff810" UNIQUE ("tournamentId"), CONSTRAINT "PK_34bd959f3f4a90eb86e4ae24d2d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "preference" ("id" SERIAL NOT NULL, "points" smallint NOT NULL, "tournamentId" integer, "playerId" integer, "cubeId" integer, CONSTRAINT "REL_25ade6d4368eb588f85d2ddac9" UNIQUE ("tournamentId"), CONSTRAINT "REL_45f1e1f2b3e57f8e0f7b454390" UNIQUE ("playerId"), CONSTRAINT "REL_4ba97fec9473cc77ce259b2dfa" UNIQUE ("cubeId"), CONSTRAINT "PK_5c4cbf49a1e97dcbc695bf462a6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tournament_staff_members" ("tournamentId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_06430b2522bca7b93b88ebab620" PRIMARY KEY ("tournamentId", "userId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55b974f327d8b9699543848d51" ON "tournament_staff_members" ("tournamentId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d308d98c3c9cf6a76be43c8496" ON "tournament_staff_members" ("userId") `
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_9e14435153c0e71128d4d537a59" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_1a8bc2afae663107ff983490497" FOREIGN KEY ("playerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "draft" ADD CONSTRAINT "FK_c418ae417192fa54df01de6e07c" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod" ADD CONSTRAINT "FK_af93c9d2c582b2611f1ab45dcdc" FOREIGN KEY ("draftId") REFERENCES "draft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod" ADD CONSTRAINT "FK_edee8f335fe232f99d316a59085" FOREIGN KEY ("cubeId") REFERENCES "cube"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" ADD CONSTRAINT "FK_82be2dc701748b8e94226331ab3" FOREIGN KEY ("podId") REFERENCES "draft_pod"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" ADD CONSTRAINT "FK_3fb2d50210c020e6859f97d141a" FOREIGN KEY ("playerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_1118562c3d9e68a7c7d680c7afd" FOREIGN KEY ("roundId") REFERENCES "round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_7ecd38eb2baa65327de8fc6021f" FOREIGN KEY ("player1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_d1f05e5fc2a7f92e29c8e3c8e0f" FOREIGN KEY ("player2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_bdf6b29b954510a783f3931eb97" FOREIGN KEY ("resultSubmittedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "round" ADD CONSTRAINT "FK_a019f16925812eb8b9cd5ff8100" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "preference" ADD CONSTRAINT "FK_25ade6d4368eb588f85d2ddac9a" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "preference" ADD CONSTRAINT "FK_45f1e1f2b3e57f8e0f7b4543903" FOREIGN KEY ("playerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "preference" ADD CONSTRAINT "FK_4ba97fec9473cc77ce259b2dfa3" FOREIGN KEY ("cubeId") REFERENCES "cube"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" ADD CONSTRAINT "FK_55b974f327d8b9699543848d512" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" ADD CONSTRAINT "FK_d308d98c3c9cf6a76be43c84960" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" DROP CONSTRAINT "FK_d308d98c3c9cf6a76be43c84960"`
    );
    await queryRunner.query(
      `ALTER TABLE "tournament_staff_members" DROP CONSTRAINT "FK_55b974f327d8b9699543848d512"`
    );
    await queryRunner.query(
      `ALTER TABLE "preference" DROP CONSTRAINT "FK_4ba97fec9473cc77ce259b2dfa3"`
    );
    await queryRunner.query(
      `ALTER TABLE "preference" DROP CONSTRAINT "FK_45f1e1f2b3e57f8e0f7b4543903"`
    );
    await queryRunner.query(
      `ALTER TABLE "preference" DROP CONSTRAINT "FK_25ade6d4368eb588f85d2ddac9a"`
    );
    await queryRunner.query(
      `ALTER TABLE "round" DROP CONSTRAINT "FK_a019f16925812eb8b9cd5ff8100"`
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_bdf6b29b954510a783f3931eb97"`
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_d1f05e5fc2a7f92e29c8e3c8e0f"`
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_7ecd38eb2baa65327de8fc6021f"`
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_1118562c3d9e68a7c7d680c7afd"`
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" DROP CONSTRAINT "FK_3fb2d50210c020e6859f97d141a"`
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod_seat" DROP CONSTRAINT "FK_82be2dc701748b8e94226331ab3"`
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod" DROP CONSTRAINT "FK_edee8f335fe232f99d316a59085"`
    );
    await queryRunner.query(
      `ALTER TABLE "draft_pod" DROP CONSTRAINT "FK_af93c9d2c582b2611f1ab45dcdc"`
    );
    await queryRunner.query(
      `ALTER TABLE "draft" DROP CONSTRAINT "FK_c418ae417192fa54df01de6e07c"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_1a8bc2afae663107ff983490497"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_9e14435153c0e71128d4d537a59"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d308d98c3c9cf6a76be43c8496"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_55b974f327d8b9699543848d51"`
    );
    await queryRunner.query(`DROP TABLE "tournament_staff_members"`);
    await queryRunner.query(`DROP TABLE "preference"`);
    await queryRunner.query(`DROP TABLE "round"`);
    await queryRunner.query(`DROP TABLE "match"`);
    await queryRunner.query(`DROP TABLE "draft_pod_seat"`);
    await queryRunner.query(`DROP TABLE "draft_pod"`);
    await queryRunner.query(`DROP TABLE "draft"`);
    await queryRunner.query(`DROP TABLE "tournament"`);
    await queryRunner.query(`DROP TABLE "enrollment"`);
  }
}
