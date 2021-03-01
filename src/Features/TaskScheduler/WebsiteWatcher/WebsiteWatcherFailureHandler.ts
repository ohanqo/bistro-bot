import { TYPES } from "@/App/AppTypes";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { fail, throws } from "assert";
import { Client, Message } from "discord.js";
import { inject, injectable } from "inversify";
import { Page } from "puppeteer";
import { Repository } from "typeorm";
import WebsiteWatcherFailureMessageBuilder from "./MessageBuilder/WebsiteWatcherFailureMessageBuilder";
import WatcherFailureEntity from "./WatcherFailureEntity";

@injectable()
export default class WebsiteWatcherFailureHandler {
  constructor(
    @inject(TYPES.CLIENT)
    private client: Client,
    @inject(TYPES.WATCHER_FAILURE_REPOSITORY)
    private failureRepository: Repository<WatcherFailureEntity>,
    @inject(TYPES.WEBSITE_WATCHER_FAILURE_MESSAGE_BUILDER)
    private messageBuilder: WebsiteWatcherFailureMessageBuilder,
  ) {}

  public async handleFailure(page: Page, watcher: WebsiteWatcherEntity) {
    try {
      const existingFailure = await this.failureRepository.findOne({ where: { watcher } });
      if (existingFailure !== undefined) return;

      const message = await this.sendFailureDM(page, watcher);
      if (message === undefined) return;

      await this.saveFailure(watcher, message.id);
    } catch (error) {
      console.log(
        "[FAILURE-HANDLER] — An error as occurred while searching for a failure in the database…",
        error?.message,
      );
    }
  }

  private async sendFailureDM(
    page: Page,
    watcher: WebsiteWatcherEntity,
  ): Promise<Message | undefined> {
    try {
      const message = await this.messageBuilder.build(page, watcher);
      const author = await this.client.users.fetch(watcher.authorId);

      return await author.send(message);
    } catch (error) {
      console.log(
        "[FAILURE-HANDLER] — An error as occurred while trying to send message…",
        error?.message,
      );

      return undefined;
    }
  }

  private async saveFailure(watcher: WebsiteWatcherEntity, messageId: string) {
    try {
      const failure = new WatcherFailureEntity();
      failure.watcher = watcher;
      failure.messageId = messageId;

      await this.failureRepository.save(failure);
    } catch (error) {
      console.log(
        "[FAILURE-HANDLER] — An error as occurred while trying to save new failure in the database…",
        error?.message,
      );
    }
  }
}
