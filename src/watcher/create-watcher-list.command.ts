import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import PrivateOption from "@/core/option/common/private.option"
import { options } from "@/core/option/option.decorator"
import { CommandInteraction } from "discord.js"
import { inject } from "inversify"
import PerformWatchOnListJob from "./jobs/perform-watch-list.job"
import ScheduleWatcherListJob from "./jobs/schedule-watcher-list.job"
import SendErrorMessageJob from "./jobs/send-error-message.job"
import SendMessageJob from "./jobs/send-message.job"
import ColorOption from "./options/color.option"
import CookieOption from "./options/cookie.option"
import DescriptionOption from "./options/description.option"
import ElementQuerySelectorOption from "./options/element-query.option"
import InnerTextQueryOption from "./options/inner-text-query.option"
import InnerTitleQueryOption from "./options/inner-title-query.option"
import RecurrenceOption from "./options/recurrence.option"
import ScreenshotOption from "./options/screenshot.option"
import TitleOption from "./options/title.option"
import UrlOption from "./options/url.option"
import WatcherPipeline from "./watcher.pipeline"

@command("watcher-create-list", "Surveille des sections se composants de plusieurs éléments.")
@options(
  UrlOption,
  ElementQuerySelectorOption,
  PrivateOption,
  RecurrenceOption,
  CookieOption,
  TitleOption,
  DescriptionOption,
  ScreenshotOption,
  ColorOption,
  InnerTitleQueryOption,
  InnerTextQueryOption
)
export default class CreateWatcherListCommand extends Command {
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

    await this.watcherPipeline.runJobs({
      jobs: [
        new PerformWatchOnListJob(
          commandOptions.url,
          commandOptions["element-query"],
          commandOptions.cookie
        ),
        new ScheduleWatcherListJob(commandOptions, this.interaction),
        new SendMessageJob(this.interaction, "Watcher sauvegardé !")
      ],
      errorJobs: [
        new SendErrorMessageJob(
          this.interaction,
          "Le QuerySelector n'est peut-être pas correct…"
        )
      ]
    })
  }
}

export type CommandOptions = {
  url: string
  "element-query": string
  "privée": boolean
  "récurrence": string
  cookie: string | null
  titre: string | null
  description: string | null
  screenshot: string | null
  couleur: string | null
  "inner-title-query": string | null
  "inner-text-query": string | null
}
