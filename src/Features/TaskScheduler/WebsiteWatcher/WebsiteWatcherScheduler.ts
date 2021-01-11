import { TYPES } from "@/App/AppTypes";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import { Browser, Page } from "puppeteer";
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
    const watchers = await this.websiteWatcherRepository.find();

    for (let watcher of watchers) {
      const page = await this.browser.newPage();
      const currentOuterHTML = await this.fetchCurrentHTML(page, watcher);

      if (watcher.outerHTML != currentOuterHTML) {
        await this.websiteWatcherRepository.update(watcher.id, { outerHTML: currentOuterHTML });
        if (watcher.outerHTML !== "") await this.sendNewChangesMessage(page, watcher);
      }

      await page.close();
    }
  }

  private async sendNewChangesMessage(
    page: Page,
    { guildId, channelId, querySelector, authorId, url }: WebsiteWatcherEntity,
  ) {
    const guild = this.client.guilds.cache.find((guild) => guild.id === guildId);
    const channel = guild?.channels.cache.find((channel) => channel.id === channelId);

    const element = await page.$(querySelector);

    // scroll to element (used to load image / lazy loading)
    await page.evaluate(
      (selector) => document.querySelector(selector).scrollIntoView({ block: "center" }),
      querySelector,
    );
    await delay(3000);

    const screenshot = await element?.screenshot();
    const embedded = new MessageEmbed()
      .setTitle("🚨 Un site a été mis à jour ! 🚨")
      .setDescription(`<@!${authorId}> ${url}`)
      .setTimestamp();

    if (screenshot !== undefined && screenshot !== "") {
      embedded
        .attachFiles([{ name: "image.png", attachment: screenshot! }])
        .setImage("attachment://image.png");
    } else {
      console.log(`Impossible de prendre un screenshot de la page à l'url ${url}…`);
    }

    await (channel as TextChannel | null)?.send(embedded);
  }

  private async fetchCurrentHTML(page: Page, { url, querySelector }: WebsiteWatcherEntity) {
    await page.setUserAgent(this.constant.USER_AGENT);
    await page.goto(url, { waitUntil: "networkidle0" });
    await page.waitForSelector(querySelector, { timeout: 10_000 });
    return await page.evaluate((qs) => {
      return document.querySelector(qs)?.outerHTML ?? "";
    }, querySelector);
  }
}
