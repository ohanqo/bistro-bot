import { MigrationInterface, QueryRunner } from "typeorm";

export class WebsiteWatcherCustomContent1613496892198 implements MigrationInterface {
  name = "WebsiteWatcherCustomContent1613496892198";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "website-watcher-records" ADD COLUMN "title" text DEFAULT null`,
    );
    await queryRunner.query(
      `ALTER TABLE "website-watcher-records" ADD COLUMN "screenshot_query_selector" text DEFAULT null`,
    );
    await queryRunner.query(
      `ALTER TABLE "website-watcher-records" ADD COLUMN "description_query_selector" text DEFAULT null`,
    );
    await queryRunner.query(
      `ALTER TABLE "website-watcher-records" ADD COLUMN "color" character varying DEFAULT null`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "website-watcher-records" DROP COLUMN "color"`);
    await queryRunner.query(
      `ALTER TABLE "website-watcher-records" DROP COLUMN "description_query_selector"`,
    );
    await queryRunner.query(
      `ALTER TABLE "website-watcher-records" DROP COLUMN "screenshot_query_selector"`,
    );
    await queryRunner.query(`ALTER TABLE "website-watcher-records" DROP COLUMN "title"`);
  }
}
