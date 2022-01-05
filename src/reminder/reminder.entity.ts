import DiscordEntity from "@/core/discord/discord.entity"
import { Column, DeleteDateColumn, Entity } from "typeorm"

@Entity({ name: "reminders" })
export default class ReminderEntity extends DiscordEntity {
  @Column({ name: "message", type: "text" })
  public message = ""

  @Column({ name: "is_private", type: "boolean" })
  public isPrivate = false

  @Column({ name: "member_id", type: "varchar" })
  public memberId = ""

  @Column({ name: "date", type: "timestamp with time zone" })
  public date = new Date()

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp with time zone", nullable: true })
  public deletedDate = null

  static factory(properties: {
    message: string
    isPrivate: boolean
    memberId: string
    date: Date
    channelId: string
    guildId: string
  }): ReminderEntity {
    return Object.assign(new ReminderEntity(), properties)
  }
}
