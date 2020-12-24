import { TYPES } from "@/App/AppTypes";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import { Browser } from "puppeteer";
import { Repository } from "typeorm";
import * as cron from "node-cron";

@injectable()
export default class WebsiteWatcherScheduler {
  constructor(
    @inject(TYPES.CLIENT) private client: Client,
    @inject(TYPES.BROWSER) private browser: Promise<Browser>,
    @inject(TYPES.WEBSITE_WATCHER_REPOSITORY)
    private websiteWatcherRepository: Repository<WebsiteWatcherEntity>,
  ) {}

  public async init() {
    cron.schedule("*/2 * * * *", () => {});
  }

  private async checkWebsiteUpdate() {
    const records = await this.websiteWatcherRepository.find();
    const browser = await this.browser;

    for (let { id, url, querySelector, outerHTML, guildId, channelId, authorId } of records) {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle0" });
      const currentOuterHTML = await page.evaluate((qs) => {
        return document.querySelector(qs)?.outerHTML ?? "";
      }, querySelector);

      if (outerHTML === "") {
        await this.websiteWatcherRepository.update(id, { outerHTML: currentOuterHTML });
      } else if (outerHTML != currentOuterHTML) {
        const guild = this.client.guilds.cache.find((guild) => guild.id === guildId);
        const channel = guild?.channels.cache.find((channel) => channel.id === channelId);

        await this.websiteWatcherRepository.update(id, { outerHTML: currentOuterHTML });

        const element = await page.$(querySelector);
        const screenshot = await element?.screenshot();
        const embedded = new MessageEmbed()
          .setTitle("Un site à été mis à jour!")
          .setDescription(`<@!${authorId}> ${url}`)
          .attachFiles([{ name: "image.png", attachment: screenshot ?? "" }])
          .setImage("attachment://image.png")
          .setTimestamp();

        await (channel as TextChannel | null)?.send(embedded);
      }

      await page.close();
    }
  }
}
