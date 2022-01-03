import { MigrationInterface, QueryRunner } from "typeorm"

export class Jails1614327825523 implements MigrationInterface {
  name = "Jails1614327825523"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "jails" ("id" SERIAL NOT NULL, "guild_id" character varying NOT NULL UNIQUE, "channel_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bd259f9b933f2d2b8197fdc5c9c" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "jails"`)
  }
}
