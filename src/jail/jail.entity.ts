import DiscordEntity from "@/core/discord/discord.entity"
import { Column, Entity } from "typeorm"

@Entity({ name: "jails" })
export default class JailEntity extends DiscordEntity {
  @Column({ name: "guild_id", type: "varchar", unique: true })
  public guildId = ""

  static factory(channelId: string, guildId: string): JailEntity {
    const entity = new JailEntity()
    entity.channelId = channelId
    entity.guildId = guildId
    return entity
  }
}
