import { TYPES } from "@/App/AppTypes";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import { Browser } from "puppeteer";
import { Repository } from "typeorm";
import * as cron from "node-cron";
import Constant from "@/Domain/Constant";

@injectable()
export default class WebsiteWatcherScheduler {
  constructor(
    @inject(TYPES.CLIENT) private client: Client,
    @inject(TYPES.CONSTANT) private constant: Constant,
    @inject(TYPES.BROWSER) private browser: Browser,
    @inject(TYPES.WEBSITE_WATCHER_REPOSITORY)
    private websiteWatcherRepository: Repository<WebsiteWatcherEntity>,
  ) {}

  public async init() {
    cron.schedule("*/2 * * * *", () => this.checkWebsiteUpdate());
  }

  private async checkWebsiteUpdate() {
    const records = await this.websiteWatcherRepository.find();

    for (let { id, url, querySelector, outerHTML, guildId, channelId, authorId } of records) {
      const page = await this.browser.newPage();
      await page.setUserAgent(this.constant.USER_AGENT);
      await page.goto(url, { waitUntil: "networkidle0" });
      await page.waitForSelector(querySelector, { timeout: 10_000 });
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
          .setTimestamp();

        if (screenshot !== undefined && screenshot !== "") {
          embedded
            .attachFiles([{ name: "image.png", attachment: screenshot! }])
            .setImage("attachment://image.png");
        } else {
          console.log("Impossible de prendre un screenshot de la page…");
        }

        await (channel as TextChannel | null)?.send(embedded);
      }

      await page.close();
    }
  }
}
