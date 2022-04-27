import { TYPES } from "@/core/app/app.types"
import { resolveTextContentByQuery } from "@/core/browser/browser.extensions"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { ReplyOptions } from "@/core/discord/discord.extensions"
import Logger from "@/core/logger/logger"
import PrivateOption from "@/core/option/common/private.option"
import { options } from "@/core/option/option.decorator"
import { CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js"
import { inject } from "inversify"
import { Browser, Page } from "puppeteer"
import PerformWatchJob from "./jobs/perform-watch.job"
import ScheduleWatcherJob from "./jobs/schedule-watcher.job"
import SendErrorMessageJob from "./jobs/send-error-message.job"
import SendMessageJob from "./jobs/send-message.job"
import ColorOption from "./options/color.option"
import CookieOption from "./options/cookie.option"
import DescriptionOption from "./options/description.option"
import ElementQuerySelectorOption from "./options/element-query.option"
import RecurrenceOption from "./options/recurrence.option"
import ScreenshotOption from "./options/screenshot.option"
import TitleOption from "./options/title.option"
import UrlOption from "./options/url.option"
import WatcherEntity from "./watcher.entity"
import WatcherPipeline from "./watcher.pipeline"
import WatcherScheduler from "./watcher.scheduler"

@command(
  "watcher-create",
  "Permets d’être notifié lors d'un changement d'une page web ou à des récurrences définies."
)
@options(
  UrlOption,
  ElementQuerySelectorOption,
  PrivateOption,
  RecurrenceOption,
  CookieOption,
  TitleOption,
  DescriptionOption,
  ScreenshotOption,
  ColorOption
)
export default class CreateWatcherCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION)
    private interaction: CommandInteraction,
    @inject(TYPES.WATCHER_PIPELINE)
    private watcherPipeline: WatcherPipeline
  ) {
    super()
  }

  async execute(): Promise<void> {
    const commandOptions: CommandOptions = this.getCommandOptions(this.interaction)

    await this.interaction.deferReply({ ephemeral: true })

    const performWatchJob = new PerformWatchJob(
      commandOptions.url,
      commandOptions["element-query"],
      commandOptions.cookie
    )

    const scheduleWatcherJob = new ScheduleWatcherJob(commandOptions, this.interaction)

    const sendMessage = new SendMessageJob(this.interaction, "Watcher sauvegardé !")

    const sendErrorMessageJob = new SendErrorMessageJob(
      this.interaction,
      "Le QuerySelector ou le texte n'est peut-être pas correct…"
    )

    await this.watcherPipeline.runJobs({
      jobs: [performWatchJob, scheduleWatcherJob, sendMessage],
      errorJobs: [sendErrorMessageJob]
    })
  }
}

export type CommandOptions = {
  url: string
  'element-query': string
  'privée': boolean
  'récurrence': string
  cookie: string | null
  titre: string | null
  description: string | null
  screenshot: string | null
  couleur: string | null
}
