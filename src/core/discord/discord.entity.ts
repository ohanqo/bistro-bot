import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export default abstract class DiscordEntity {
  @PrimaryGeneratedColumn()
  public id = 0

  @Column({ name: "guild_id", type: "varchar" })
  public guildId = ""

  @Column({ name: "channel_id", type: "varchar" })
  public channelId = ""

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  public createdAt!: Date

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  public updatedAt!: Date
}
