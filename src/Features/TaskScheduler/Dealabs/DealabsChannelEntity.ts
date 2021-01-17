import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "deals-channel-records" })
export default class DealabsChannelEntity {
  @PrimaryGeneratedColumn()
  public id = 0;

  @Column({ name: "guild_id", type: "varchar" })
  public guildId = "";

  @Column({ name: "channel_id", type: "varchar" })
  public channelId = "";

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt!: Date;
}
