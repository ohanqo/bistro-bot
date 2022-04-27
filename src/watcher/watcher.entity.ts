import DiscordEntity from "@/core/discord/discord.entity"
import { Column, DeleteDateColumn, Entity } from "typeorm"

@Entity({ name: "watchers" })
export default class WatcherEntity extends DiscordEntity {
  @Column({ type: "text" })
  public url = ""

  @Column({ name: "element_query_selector", type: "text" })
  public elementQuerySelector = ""

  @Column({ name: "element_text_content", type: "text" })
  public elementTextContent = ""

  @Column({ name: "member_id", type: "varchar" })
  public memberId = ""

  @Column({ name: "is_private", type: "boolean" })
  public isPrivate = false

  @Column({ type: "varchar" })
  public recurrence: string = ""

  @Column({ type: "text", nullable: true, default: null })
  public cookie: string | null = null

  @Column({ type: "varchar", nullable: true, default: null })
  public title: string | null = null

  @Column({ name: "screenshot_query_selector", type: "text", nullable: true, default: null })
  public screenshotQuerySelector: string | null = null

  @Column({ name: "description_query_selector", type: "text", nullable: true, default: null })
  public descriptionQuerySelector: string | null = null

  @Column({ type: "varchar", nullable: true, default: null })
  public color: string | null = null

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp with time zone", nullable: true })
  public deletedDate = null

  static factory(properties: {
    url: string
    elementQuerySelector: string
    elementTextContent: string
    memberId: string
    isPrivate: boolean
    title: string | null
    screenshotQuerySelector: string | null
    descriptionQuerySelector: string | null
    color: string | null
    guildId: string
    channelId: string
    recurrence: string | null
    cookie: string | null
  }): WatcherEntity {
    return Object.assign(new WatcherEntity(), properties)
  }
}
