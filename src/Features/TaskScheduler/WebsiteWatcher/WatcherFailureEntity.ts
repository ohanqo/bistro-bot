import WebsiteWatcherEntity from "../../Command/WebsiteWatcher/WebsiteWatcherEntity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "watcher-failure-records" })
export default class WatcherFailureEntity {
  @PrimaryGeneratedColumn()
  public id = 0;

  @OneToOne(() => WebsiteWatcherEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "watcher_id" })
  public watcher!: WebsiteWatcherEntity;

  @Column({ name: "message_id" })
  public messageId!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  public createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  public updatedAt!: Date;
}
