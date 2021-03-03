import { TYPES } from "@/App/AppTypes";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
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

      if (existingFailure) {
        const shouldNotifyAuthor = existingFailure.retryCount === 2;
        const shouldIncrementRetryCount = existingFailure.retryCount < 3;

        if (shouldNotifyAuthor) await this.notifyAuthor(page, watcher, existingFailure);
        else if (shouldIncrementRetryCount) await this.incrementRetryCount(existingFailure);
      } else {
        await this.saveWatcherFailure({ watcher });
      }
    } catch (error) {
      console.log(
        "[FAILURE-HANDLER] — An error as occurred while searching for a failure in the database…",
        error?.message,
      );
    }
  }

  private async notifyAuthor(
    page: Page,
    watcher: WebsiteWatcherEntity,
    failure: WatcherFailureEntity,
  ) {
    const message = await this.sendFailureDM(page, watcher);
    if (!message) return;

    await this.saveWatcherFailure({
      ...failure,
      messageId: message.id,
      retryCount: failure.retryCount + 1,
    });
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

  private async incrementRetryCount(existingFailure: WatcherFailureEntity) {
    await this.saveWatcherFailure({
      ...existingFailure,
      retryCount: existingFailure.retryCount + 1,
    });
  }

  private async saveWatcherFailure(failure: Partial<WatcherFailureEntity>) {
    try {
      const failureEntity = Object.assign(new WatcherFailureEntity(), failure);
      await this.failureRepository.save(failureEntity);
    } catch (error) {
      console.log(
        "[FAILURE-HANDLER] — An error as occurred while trying to save/update failure in the database…",
        error?.message,
      );
    }
  }
}
