import { MigrationInterface, QueryRunner } from "typeorm";

export class WatcherFailureRecords1614513716544 implements MigrationInterface {
  name = "WatcherFailureRecords1614513716544";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "watcher-failure-records" ("id" SERIAL NOT NULL, "message_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "watcher_id" integer, CONSTRAINT "REL_cc1e4524e0ca278aa44c6e369d" UNIQUE ("watcher_id"), CONSTRAINT "PK_97e860901ed886f7ef97cfefffd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "watcher-failure-records" ADD CONSTRAINT "FK_cc1e4524e0ca278aa44c6e369d7" FOREIGN KEY ("watcher_id") REFERENCES "website-watcher-records"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "watcher-failure-records" DROP CONSTRAINT "FK_cc1e4524e0ca278aa44c6e369d7"`,
    );
    await queryRunner.query(`DROP TABLE "watcher-failure-records"`);
  }
}
