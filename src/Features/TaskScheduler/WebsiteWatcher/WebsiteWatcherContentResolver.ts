import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { injectable } from "inversify";
import { Page } from "puppeteer";

@injectable()
export default class WebsiteWatcherContentResolver {
  public async resolveElementHTML(
    page: Page,
    { url, querySelector }: WebsiteWatcherEntity,
  ): Promise<string> {
    await page.goto(url, { waitUntil: "networkidle0" });
    await page.waitForSelector(querySelector, { timeout: 10_000 });
    return await page.evaluate((qs) => {
      return document.querySelector(qs)?.outerHTML ?? "";
    }, querySelector);
  }

  public async resolveElementText(page: Page, querySelector: string): Promise<string> {
    return await page.evaluate((qs) => {
      return document.querySelector(qs)?.outerText ?? "";
    }, querySelector);
  }
}
