import { TYPES } from "@/App/AppTypes";
import ScreenshotResolver from "@/Domain/Browser/ScreenshotResolver";
import Constant from "@/Domain/Constant";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { MessageEmbed } from "discord.js";
import { inject, injectable } from "inversify";
import { Page } from "puppeteer";

@injectable()
export default class WebsiteWatcherFailureMessageBuilder {
  private message = new MessageEmbed();

  constructor(
    @inject(TYPES.CONSTANT)
    private constant: Constant,
    @inject(TYPES.SCREENSHOT_RESOLVER)
    private screenshotResolver: ScreenshotResolver,
  ) {}

  public async build(
    page: Page,
    { id, url, querySelector }: WebsiteWatcherEntity,
  ): Promise<MessageEmbed> {
    this.message = new MessageEmbed();

    this.message.setTitle(this.constant.WATCHER_FAILURE_TITLE);
    this.message.setURL(url);
    this.message.setDescription(
      `Le watcher \`${id}\` n'est plus fonctionnel, ce qui implique que tu ne sera plus notifié des futurs changements. Le QuerySelector que tu as saisi n'est sûement plus valide. \n \n URL: ${url} \n  QuerySelector: \`${querySelector}\` \n \n Si tu as résolu le problème, ajoute n'importe quelle réaction à ce message pour que je te notifie de nouveau en cas de problème.`,
    );
    this.message.setColor("#EF4444");
    await this.putScreenshot(page);

    return this.message;
  }

  private async putScreenshot(page: Page) {
    try {
      const screenshot = await this.screenshotResolver.takeFullPageScreenshot(page);

      if (screenshot === undefined || screenshot === "") return;

      this.message
        .attachFiles([{ name: "image.png", attachment: screenshot }])
        .setImage("attachment://image.png");
    } catch (error) {
      console.error(
        "[FAILURE-MESSAGE-BUILDER] — Unable to take screenshot of the website…",
        error?.message,
      );
    }
  }
}
