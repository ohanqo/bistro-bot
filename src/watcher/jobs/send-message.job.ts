import { CommandInteraction } from "discord.js"
import { Page } from "puppeteer"
import PipelineContext from "../pipeline.context"
import { Job } from "./job"

export default class SendMessageJob implements Job {
  constructor(private interaction: CommandInteraction, private message: string) {}

  async execute(_: Page, __: PipelineContext): Promise<void> {
    await this.interaction.editReply({
      content: this.message
    })
  }
}
