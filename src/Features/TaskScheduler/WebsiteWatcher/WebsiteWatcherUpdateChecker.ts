import { TYPES } from "@/App/AppTypes";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { inject, injectable } from "inversify";
import { Browser } from "puppeteer";
import ContentResolver from "@/Domain/Browser/ContentResolver";
import WebsiteWatcherUpdateHandler from "./WebsiteWatcherUpdateHandler";
import WebsiteWatcherFailureHandler from "./WebsiteWatcherFailureHandler";
import { Repository } from "typeorm";
import WatcherFailureEntity from "./WatcherFailureEntity";

@injectable()
export default class WebsiteWatcherUpdateChecker {
  constructor(
    @inject(TYPES.BROWSER)
    private browser: Browser,
    @inject(TYPES.WEBSITE_WATCHER_UPDATE_HANDLER)
    private updateHandler: WebsiteWatcherUpdateHandler,
    @inject(TYPES.WEBSITE_WATCHER_FAILURE_HANDLER)
    private failureHandler: WebsiteWatcherFailureHandler,
    @inject(TYPES.CONTENT_RESOLVER)
    private contentResolver: ContentResolver,
    @inject(TYPES.WATCHER_FAILURE_REPOSITORY)
    private watcherFailureRepository: Repository<WatcherFailureEntity>,
  ) {}

  public async checkForAnUpdate(watcher: WebsiteWatcherEntity) {
    const page = await this.browser.newPage();

    try {
      const fetchedHTML = await this.contentResolver.resolveElementHTML(
        page,
        watcher.url,
        watcher.querySelector,
      );

      if (watcher.outerHTML != fetchedHTML) {
        await this.updateHandler.handleUpdate(page, watcher, fetchedHTML);
      }

      await this.removePotentialFailureFromDatabase(watcher);
    } catch (error) {
      console.error(
        `[UPDATE-CHECKER] — An error occurred with the following page: ${watcher.url}`,
        error?.message,
      );

      await this.failureHandler.handleFailure(page, watcher);
    } finally {
      await page.close();
    }
  }

  private async removePotentialFailureFromDatabase(watcher: WebsiteWatcherEntity) {
    try {
      const failure = await this.watcherFailureRepository.findOne({ watcher });
      if (failure) await this.watcherFailureRepository.remove(failure);
    } catch (error) {
      console.log(
        `[UPDATE-CHECKER] — An error as occurred while trying to search/delete existings failures from the database with the watcherId: ${watcher.id}`,
        error?.message,
      );
    }
  }
}
