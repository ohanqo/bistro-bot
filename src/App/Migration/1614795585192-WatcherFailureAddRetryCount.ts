import { MigrationInterface, QueryRunner } from "typeorm";

export class WatcherFailureAddRetryCount1614795585192 implements MigrationInterface {
  name = "WatcherFailureAddRetryCount1614795585192";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "watcher-failure-records" ADD "retry_count" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(`ALTER TABLE "watcher-failure-records" DROP COLUMN "message_id"`);
    await queryRunner.query(
      `ALTER TABLE "watcher-failure-records" ADD "message_id" text DEFAULT null`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "watcher-failure-records" DROP COLUMN "message_id"`);
    await queryRunner.query(
      `ALTER TABLE "watcher-failure-records" ADD "message_id" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "watcher-failure-records" DROP COLUMN "retry_count"`);
  }
}
