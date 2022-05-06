import { resolveOuterHtmlListByQuery } from "@/core/browser/browser.extensions"
import { Page } from "puppeteer"
import PipelineContext from "../pipeline.context"
import { Job } from "./job"
import * as cheerio from "cheerio"
import { textSeparator } from "@/core/constants"

export default class PerformWatchOnListJob implements Job {
  constructor(private url: string, private querySelector: string, private cookie: string | null) {}

  async execute(page: Page, context: PipelineContext): Promise<void> {
    this.cookie && (await page.setCookie(...this.cookie.extractCookies()))
    const outerHtmlList = await resolveOuterHtmlListByQuery(page, this.url, this.querySelector)
    context.outerHtmlList = outerHtmlList

    const contentList = outerHtmlList.map((htmlElement) =>
      cheerio.load(htmlElement, null, false).text()
    )
    context.textContent = contentList.join(textSeparator)
  }
}
