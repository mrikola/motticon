import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelationships1704827517342 implements MigrationInterface {
    name = 'FixRelationships1704827517342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_cubes" DROP CONSTRAINT "FK_3d80b42e4029c7fb5b9d6974ab7"`);
        await queryRunner.query(`ALTER TABLE "draft" DROP CONSTRAINT "FK_c418ae417192fa54df01de6e07c"`);
        await queryRunner.query(`ALTER TABLE "draft" DROP CONSTRAINT "UQ_04f5c8c6c3daba2af5e067645ed"`);
        await queryRunner.query(`ALTER TABLE "draft" DROP CONSTRAINT "REL_c418ae417192fa54df01de6e07"`);
        await queryRunner.query(`ALTER TABLE "preference" DROP CONSTRAINT "FK_25ade6d4368eb588f85d2ddac9a"`);
        await queryRunner.query(`ALTER TABLE "preference" DROP CONSTRAINT "FK_45f1e1f2b3e57f8e0f7b4543903"`);
        await queryRunner.query(`ALTER TABLE "preference" DROP CONSTRAINT "FK_4ba97fec9473cc77ce259b2dfa3"`);
        await queryRunner.query(`ALTER TABLE "preference" DROP CONSTRAINT "REL_25ade6d4368eb588f85d2ddac9"`);
        await queryRunner.query(`ALTER TABLE "preference" DROP CONSTRAINT "REL_45f1e1f2b3e57f8e0f7b454390"`);
        await queryRunner.query(`ALTER TABLE "preference" DROP CONSTRAINT "REL_4ba97fec9473cc77ce259b2dfa"`);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_a019f16925812eb8b9cd5ff8100"`);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "REL_a019f16925812eb8b9cd5ff810"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_7ecd38eb2baa65327de8fc6021f"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_d1f05e5fc2a7f92e29c8e3c8e0f"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_bdf6b29b954510a783f3931eb97"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "REL_7ecd38eb2baa65327de8fc6021"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "REL_d1f05e5fc2a7f92e29c8e3c8e0"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "REL_bdf6b29b954510a783f3931eb9"`);
        await queryRunner.query(`ALTER TABLE "draft" ADD CONSTRAINT "UQ_04f5c8c6c3daba2af5e067645ed" UNIQUE ("tournamentId", "draftNumber")`);
        await queryRunner.query(`ALTER TABLE "draft" ADD CONSTRAINT "FK_c418ae417192fa54df01de6e07c" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "preference" ADD CONSTRAINT "FK_25ade6d4368eb588f85d2ddac9a" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "preference" ADD CONSTRAINT "FK_45f1e1f2b3e57f8e0f7b4543903" FOREIGN KEY ("playerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "preference" ADD CONSTRAINT "FK_4ba97fec9473cc77ce259b2dfa3" FOREIGN KEY ("cubeId") REFERENCES "cube"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_a019f16925812eb8b9cd5ff8100" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_7ecd38eb2baa65327de8fc6021f" FOREIGN KEY ("player1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_d1f05e5fc2a7f92e29c8e3c8e0f" FOREIGN KEY ("player2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_bdf6b29b954510a783f3931eb97" FOREIGN KEY ("resultSubmittedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_cubes" ADD CONSTRAINT "FK_3d80b42e4029c7fb5b9d6974ab7" FOREIGN KEY ("cubeId") REFERENCES "cube"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_cubes" DROP CONSTRAINT "FK_3d80b42e4029c7fb5b9d6974ab7"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_bdf6b29b954510a783f3931eb97"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_d1f05e5fc2a7f92e29c8e3c8e0f"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_7ecd38eb2baa65327de8fc6021f"`);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_a019f16925812eb8b9cd5ff8100"`);
        await queryRunner.query(`ALTER TABLE "preference" DROP CONSTRAINT "FK_4ba97fec9473cc77ce259b2dfa3"`);
        await queryRunner.query(`ALTER TABLE "preference" DROP CONSTRAINT "FK_45f1e1f2b3e57f8e0f7b4543903"`);
        await queryRunner.query(`ALTER TABLE "preference" DROP CONSTRAINT "FK_25ade6d4368eb588f85d2ddac9a"`);
        await queryRunner.query(`ALTER TABLE "draft" DROP CONSTRAINT "FK_c418ae417192fa54df01de6e07c"`);
        await queryRunner.query(`ALTER TABLE "draft" DROP CONSTRAINT "UQ_04f5c8c6c3daba2af5e067645ed"`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "REL_bdf6b29b954510a783f3931eb9" UNIQUE ("resultSubmittedById")`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "REL_d1f05e5fc2a7f92e29c8e3c8e0" UNIQUE ("player2Id")`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "REL_7ecd38eb2baa65327de8fc6021" UNIQUE ("player1Id")`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_bdf6b29b954510a783f3931eb97" FOREIGN KEY ("resultSubmittedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_d1f05e5fc2a7f92e29c8e3c8e0f" FOREIGN KEY ("player2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_7ecd38eb2baa65327de8fc6021f" FOREIGN KEY ("player1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "REL_a019f16925812eb8b9cd5ff810" UNIQUE ("tournamentId")`);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_a019f16925812eb8b9cd5ff8100" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "preference" ADD CONSTRAINT "REL_4ba97fec9473cc77ce259b2dfa" UNIQUE ("cubeId")`);
        await queryRunner.query(`ALTER TABLE "preference" ADD CONSTRAINT "REL_45f1e1f2b3e57f8e0f7b454390" UNIQUE ("playerId")`);
        await queryRunner.query(`ALTER TABLE "preference" ADD CONSTRAINT "REL_25ade6d4368eb588f85d2ddac9" UNIQUE ("tournamentId")`);
        await queryRunner.query(`ALTER TABLE "preference" ADD CONSTRAINT "FK_4ba97fec9473cc77ce259b2dfa3" FOREIGN KEY ("cubeId") REFERENCES "cube"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "preference" ADD CONSTRAINT "FK_45f1e1f2b3e57f8e0f7b4543903" FOREIGN KEY ("playerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "preference" ADD CONSTRAINT "FK_25ade6d4368eb588f85d2ddac9a" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft" ADD CONSTRAINT "REL_c418ae417192fa54df01de6e07" UNIQUE ("tournamentId")`);
        await queryRunner.query(`ALTER TABLE "draft" ADD CONSTRAINT "UQ_04f5c8c6c3daba2af5e067645ed" UNIQUE ("draftNumber", "tournamentId")`);
        await queryRunner.query(`ALTER TABLE "draft" ADD CONSTRAINT "FK_c418ae417192fa54df01de6e07c" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_cubes" ADD CONSTRAINT "FK_3d80b42e4029c7fb5b9d6974ab7" FOREIGN KEY ("cubeId") REFERENCES "cube"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
