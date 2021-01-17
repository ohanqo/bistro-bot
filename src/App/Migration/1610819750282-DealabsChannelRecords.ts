import {MigrationInterface, QueryRunner} from "typeorm";

export class DealabsChannelRecords1610819750282 implements MigrationInterface {
    name = 'DealabsChannelRecords1610819750282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deals-channel-records" ("id" SERIAL NOT NULL, "guild_id" character varying NOT NULL, "channel_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_deabec2257999557c14dfb5471c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "deals-channel-records"`);
    }

}
