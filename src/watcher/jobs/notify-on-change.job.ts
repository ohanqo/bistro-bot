import { TYPES } from "@/core/app/app.types"
import { takeScreenshot } from "@/core/browser/browser.extensions"
import { coreContainer } from "@/core/core.container"
import Logger from "@/core/logger/logger"
import {
  Client,
  ColorResolvable,
  MessageAttachment,
  MessageEmbed,
  MessageOptions
} from "discord.js"
import { Page } from "puppeteer"
import PipelineContext from "../pipeline.context"
import WatcherEntity from "../watcher.entity"
import { Job } from "./job"

export default class NotifyOnChangeJob implements Job {
  constructor(
    private watcher: WatcherEntity,
    private options: MessageOptions = {},
    private message = new MessageEmbed()
  ) {}

  async execute(page: Page, { hasContentChanged, logger }: PipelineContext): Promise<void> {
    if (hasContentChanged == null || hasContentChanged == false) return

    this.putTitleAndColor()
    this.putAuthor()
    this.putFooter()
    await this.putScreenshot(page)
    await this.putDescription(page)
    await this.notify(logger)
  }

  private putTitleAndColor() {
    this.message.setTitle(this.watcher.title ?? "Un site à été mis à jour !")
    this.message.setColor((this.watcher.color as ColorResolvable) ?? "#6868AC")
    this.message.setTimestamp()
  }

  private putAuthor() {
    const iconUrl = `https://besticon.herokuapp.com/icon?size=80..120..200&url=${this.watcher.url}`
    this.message.setAuthor({ name: "Site Web", url: this.watcher.url, iconURL: iconUrl })
  }

  private putFooter() {
    const client = coreContainer.get<Client>(TYPES.CLIENT)
    const member = client.findMember(this.watcher.guildId, this.watcher.memberId)
    const avatarUrl = member?.displayAvatarURL()
    if (member == null || member.nickname == null || avatarUrl == null) return
    this.message.setFooter({ text: member.nickname, iconURL: avatarUrl })
  }

  private async putScreenshot(page: Page) {
    const { elementQuerySelector, screenshotQuerySelector } = this.watcher
    const selector = screenshotQuerySelector ?? elementQuerySelector
    const screenshot = await takeScreenshot(page, selector)

    if (screenshot !== undefined && screenshot !== "") {
      const file = new MessageAttachment(screenshot, "image.png")
      this.options.files = [file]
      this.message.setImage("attachment://image.png")
    }
  }

  private async putDescription(page: Page) {
    const { descriptionQuerySelector } = this.watcher

    if (!descriptionQuerySelector) return

    const fetchedHTML = (await page.evaluate((qs) => {
      return document.querySelector(qs)?.textContent ?? ""
    }, descriptionQuerySelector)) as string

    this.message.setDescription(fetchedHTML)
  }

  private async notify(logger: Logger) {
    const client = coreContainer.get<Client>(TYPES.CLIENT)
    this.options.embeds = [this.message]

    if (this.watcher.isPrivate) {
      const member = client.findMember(this.watcher.guildId, this.watcher.memberId)
      logger.info(`[WATCHER] notify member with id ${member?.id}`)
      await member?.send(this.options)
    } else {
      const channel = client.findChannel(this.watcher.guildId, this.watcher.channelId)
      logger.info(`[WATCHER] notify channel with id ${channel?.id}`)
      await channel?.send(this.options)
    }
  }
}
