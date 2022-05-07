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
import * as cheerio from "cheerio"

export default class NotifyOnChangeJob implements Job {
  constructor(
    private watcher: WatcherEntity,
    private options: MessageOptions = {},
    private message = new MessageEmbed()
  ) {}

  async execute(
    page: Page,
    { hasContentChanged, logger, outerHtmlList }: PipelineContext
  ): Promise<void> {
    if (hasContentChanged == null || hasContentChanged == false) return

    this.putTitleAndColor()
    this.putAuthor()
    this.putFooter()
    this.watcher.isWatcherList && this.putFields(outerHtmlList, page)
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

  private putFields(outerHtmlList: string[] | null, page: Page) {
    if (
      outerHtmlList == null ||
      (this.watcher.innerTitleQuery == null && this.watcher.innerTextQuery == null)
    )
      return

    outerHtmlList.forEach((htmlElement) => {
      const $ = cheerio.load(htmlElement, null, false)
      const name = $(this.watcher.innerTitleQuery ?? "Aucun élément").text()
      const value = this.parseValue($, page)
      this.message.addField(name, value)
    })

    this.prettifyFieldsWithSpacing()
  }

  private parseValue($: cheerio.CheerioAPI, page: Page): string {
    if (this.watcher.innerTextQuery == null) {
      return "Aucun élément"
    } else if (this.watcher.innerTextQuery?.includes("href")) {
      const potentialHref = $.root().find("a").attr("href")
      if (potentialHref) {
        return page.url().slice(0, -1) + potentialHref
      } else {
        return "Lien non disponible…"
      }
    } else {
      return $(this.watcher.innerTextQuery).text()
    }
  }

  private prettifyFieldsWithSpacing() {
    const amount = this.message.fields.length

    if (amount > 7 && amount % 2 === 0) {
      let splitNumber = 0
      for (let i = 2; i <= 6; i++) {
        const number = amount / i
        if (number % 1 === 0 && number + amount <= 25) {
          splitNumber = number
        }
      }

      for (var i = 1; i < splitNumber; i++) {
        const splitIndex = (amount / splitNumber) * i
        const offset = this.message.fields.length - amount
        this.message.spliceFields(splitIndex + offset, 0, { name: "\u200B", value: "\u200B" })
      }
    }
  }

  private async putScreenshot(page: Page) {
    const { screenshotQuerySelector } = this.watcher

    if (screenshotQuerySelector === null) return

    const screenshot = await takeScreenshot(page, screenshotQuerySelector)

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
