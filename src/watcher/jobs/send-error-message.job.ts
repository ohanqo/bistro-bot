import { ReplyOptions } from "@/core/discord/discord.extensions";
import { CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js";
import { Page } from "puppeteer";
import PipelineContext from "../pipeline.context";
import { Job } from "./job"

export default class SendErrorMessageJob implements Job {
  constructor(private interaction: CommandInteraction, private message: string) {}

  async execute(page: Page, _: PipelineContext): Promise<void> {
    try {
      const options: ReplyOptions = { ephemeral: true }
      const screenshot = await page.screenshot()

      if (screenshot !== undefined && screenshot !== "") {
        const file = new MessageAttachment(screenshot, "image.png")
        options.files = [file]
      }

      options.embeds = [
        new MessageEmbed()
          .setColor("#EF4444")
          .setTitle("Une erreur est survenue")
          .setDescription(this.message)
          .setImage("attachment://image.png")
      ]

      await this.interaction.editReply(options)
    } catch (error) {
      await this.interaction.editReply({ content: "Une erreur est survenue…" })
    }
  }
}