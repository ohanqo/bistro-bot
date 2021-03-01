import { TYPES } from "@/App/AppTypes";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { inject, injectable } from "inversify";
import { Browser } from "puppeteer";
import ContentResolver from "@/Domain/Browser/ContentResolver";
import WebsiteWatcherUpdateHandler from "./WebsiteWatcherUpdateHandler";
import WebsiteWatcherFailureHandler from "./WebsiteWatcherFailureHandler";

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
}
