import { MigrationInterface, QueryRunner } from "typeorm"

export class Watchers1642452525925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "watchers" ("id" SERIAL NOT NULL, "url" text NOT NULL, "element_query_selector" text NOT NULL, "element_text_content" text NOT NULL, "member_id" character varying NOT NULL, "is_private" boolean default false, "recurrence" character varying NOT NULL, "cookie" text DEFAULT NULL, "title" character varying DEFAULT NULL, "screenshot_query_selector" text DEFAULT NULL, "description_query_selector" text DEFAULT NULL, "color" character varying DEFAULT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL, "guild_id" character varying NOT NULL, "channel_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_abc234b933f2d2b8197nbv321" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "watchers"`)
  }
}
