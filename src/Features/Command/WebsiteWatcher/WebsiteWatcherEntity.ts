import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "website-watcher-records" })
export default class WebsiteWatcherEntity {
  @PrimaryGeneratedColumn()
  public id = 0;

  @Column({ type: "text" })
  public url = "";

  @Column({ name: "query_selector", type: "text" })
  public querySelector = "";

  @Column({ name: "outer_HTML", type: "text" })
  public outerHTML = "";

  @Column({ name: "guild_id", type: "varchar" })
  public guildId = "";

  @Column({ name: "channel_id", type: "varchar" })
  public channelId = "";

  @Column({ name: "author_id", type: "varchar" })
  public authorId = "";

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt!: Date;
}
