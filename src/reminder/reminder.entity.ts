import DiscordEntity from "@/core/discord/discord.entity"
import { Column, Entity } from "typeorm"

@Entity({ name: "reminders" })
export default class ReminderEntity extends DiscordEntity {
  @Column({ name: "message", type: "text" })
  public message = ""

  @Column({ name: "is_private", type: "boolean" })
  public isPrivate = false

  @Column({ name: "date", type: "timestamp with time zone" })
  public date = new Date()
}
