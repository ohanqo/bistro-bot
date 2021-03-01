import { injectable } from "inversify";
import { Page } from "puppeteer";

@injectable()
export default class ScreenshotResolver {
  public async takeScreenshot(page: Page, querySelector: string): Promise<string | undefined> {
    const element = await page.$(querySelector);

    // scroll to element (used to load image / lazy loading)
    await page.evaluate(
      (selector) => document.querySelector(selector).scrollIntoView({ block: "center" }),
      querySelector,
    );
    await delay(3000);

    return await element?.screenshot();
  }

  public async takeFullPageScreenshot(page: Page) {
    return await page.screenshot();
  }
}
