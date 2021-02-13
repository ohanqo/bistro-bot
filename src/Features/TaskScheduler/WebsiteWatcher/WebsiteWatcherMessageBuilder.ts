import { TYPES } from "@/App/AppTypes";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { MessageEmbed } from "discord.js";
import { inject, injectable } from "inversify";
import { Page } from "puppeteer";
import WebsiteWatcherContentResolver from "./WebsiteWatcherContentResolver";
import WebsiteWatcherScreenshotResolver from "./WebsiteWatcherScreenshotResolver";

@injectable()
export default class WebsiteWatcherMessageBuilder {
  constructor(
    private message = new MessageEmbed(),
    @inject(TYPES.WEBSITE_WATCHER_CONTENT_RESOLVER)
    private contentResolver: WebsiteWatcherContentResolver,
    @inject(TYPES.WEBSITE_WATCHER_SCREENSHOT_RESOLVER)
    private screenshotResolver: WebsiteWatcherScreenshotResolver,
  ) {}

  public async build(page: Page, watcher: WebsiteWatcherEntity): Promise<MessageEmbed> {
    const title = "Changement détecté !";
    this.message
      .setTitle(title)
      .setColor("#55ACEE")
      .setDescription(`<@!${watcher.authorId}> ${watcher.url}`)
      .setTimestamp();
    await this.putScreenshot(page, watcher);
    return this.message;
  }

  private async putScreenshot(page: Page, watcher: WebsiteWatcherEntity) {
    try {
      const querySelector = watcher.querySelector;
      const screenshot = await this.screenshotResolver.takeScreenshot(page, querySelector);

      if (screenshot === undefined || screenshot === "") return;

      this.message
        .attachFiles([{ name: "image.png", attachment: screenshot }])
        .setImage("attachment://image.png");
    } catch (error) {
      console.error(
        `[MESSAGE-BUILDER] — Unable to take screenshot on page with URL: ${watcher.url}…`,
        error,
      );
    }
  }
}
