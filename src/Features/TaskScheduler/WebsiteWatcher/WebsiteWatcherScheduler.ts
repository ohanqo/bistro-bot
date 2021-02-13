import { TYPES } from "@/App/AppTypes";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import { Browser, Page } from "puppeteer";
import { Repository } from "typeorm";
import * as cron from "node-cron";
import Constant from "@/Domain/Constant";
import WebsiteWatcherUpdateChecker from "./WebsiteWatcherUpdateChecker";

@injectable()
export default class WebsiteWatcherScheduler {
  constructor(
    @inject(TYPES.WEBSITE_WATCHER_UPDATE_CHECKER)
    private updateChecker: WebsiteWatcherUpdateChecker,
    @inject(TYPES.WEBSITE_WATCHER_REPOSITORY)
    private websiteWatcherRepository: Repository<WebsiteWatcherEntity>,
  ) {}

  public async init() {
    cron.schedule("*/2 * * * *", () => this.checkWebsiteUpdate());
  }

  private async checkWebsiteUpdate() {
    try {
      const watchers = await this.websiteWatcherRepository.find();

      for (let watcher of watchers) {
        await this.updateChecker.checkForAnUpdate(watcher);
      }
    } catch (error) {
      console.error(
        `[WEBSITE-SCHEDULER] — An error occurred while retrieving watchers from the database…`,
        error,
      );
    }
  }
}
