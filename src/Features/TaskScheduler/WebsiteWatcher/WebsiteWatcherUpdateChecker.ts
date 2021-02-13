import { TYPES } from "@/App/AppTypes";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { inject, injectable } from "inversify";
import { Browser } from "puppeteer";
import WebsiteWatcherContentResolver from "./WebsiteWatcherContentResolver";
import WebsiteWatcherUpdateHandler from "./WebsiteWatcherUpdateHandler";

@injectable()
export default class WebsiteWatcherUpdateChecker {
  constructor(
    @inject(TYPES.BROWSER)
    private browser: Browser,
    @inject(TYPES.WEBSITE_WATCHER_UPDATE_HANDLER)
    private updateHandler: WebsiteWatcherUpdateHandler,
    @inject(TYPES.WEBSITE_WATCHER_CONTENT_RESOLVER)
    private contentResolver: WebsiteWatcherContentResolver,
  ) {}

  public async checkForAnUpdate(watcher: WebsiteWatcherEntity) {
    const page = await this.browser.newPage();

    try {
      const fetchedHTML = await this.contentResolver.resolveElementHTML(page, watcher);
      if (watcher.outerHTML != fetchedHTML)
        await this.updateHandler.handleUpdate(page, watcher, fetchedHTML);
    } catch (error) {
      console.error(
        `[UPDATE-CHECKER] — An error occurred with the following page: ${watcher.url}`,
        error,
      );
    } finally {
      await page.close();
    }
  }
}
