import { TYPES } from "@/core/app/app.types"
import { coreContainer } from "@/core/core.container"
import { CommandInteraction } from "discord.js"
import { Page } from "puppeteer"
import { CommandOptions } from "../commands/create-watcher-list.command"
import PipelineContext from "../pipeline.context"
import WatcherEntity from "../watcher.entity"
import WatcherScheduler from "../watcher.scheduler"
import { Job } from "./job"

export default class ScheduleWatcherListJob implements Job {
  constructor(private commandOptions: CommandOptions, private interaction: CommandInteraction) {}

  async execute(_: Page, context: PipelineContext): Promise<any> {
    const entity = WatcherEntity.factory({
      url: this.commandOptions.url,
      elementQuerySelector: this.commandOptions["element-query"],
      isPrivate: this.commandOptions["privée"],
      recurrence: this.commandOptions["récurrence"] ?? "*/2 * * * *",
      cookie: this.commandOptions.cookie,
      title: this.commandOptions.titre,
      descriptionQuerySelector: this.commandOptions.description,
      screenshotQuerySelector: this.commandOptions.screenshot,
      color: this.commandOptions.couleur,
      channelId: this.interaction.channel?.id ?? "",
      guildId: this.interaction.guild?.id ?? "",
      memberId: this.interaction.member?.user.id ?? "",
      elementTextContent: context.textContent ?? "",
      isWatcherList: true,
      innerTitleQuery: this.commandOptions["inner-title-query"],
      innerTextQuery: this.commandOptions["inner-text-query"],
    })

    const scheduler = coreContainer.get<WatcherScheduler>(TYPES.WATCHER_SCHEDULER)

    await scheduler.scheduleNewJob(entity)
  }
}
