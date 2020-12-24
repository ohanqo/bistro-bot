import {MigrationInterface, QueryRunner} from "typeorm";

export class WebsiteWatcherRecords1608769074481 implements MigrationInterface {
    name = 'WebsiteWatcherRecords1608769074481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "website-watcher-records" ("id" SERIAL NOT NULL, "url" text NOT NULL, "query_selector" text NOT NULL, "outer_HTML" text NOT NULL, "guild_id" character varying NOT NULL, "channel_id" character varying NOT NULL, "author_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8de93a3202830e72473bd8e64d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "website-watcher-records"`);
    }

}
