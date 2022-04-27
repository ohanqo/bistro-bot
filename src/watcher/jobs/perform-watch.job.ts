import { resolveTextContentByQuery } from "@/core/browser/browser.extensions"
import { Page } from "puppeteer"
import PipelineContext from "../pipeline.context"
import { Job } from "./job"

export default class PerformWatchJob implements Job {
  constructor(private url: string, private querySelector: string, private cookie: string | null) {}

  async execute(page: Page, context: PipelineContext): Promise<void> {
    this.cookie && (await page.setCookie(...this.cookie.extractCookies()))
    const textContent = await resolveTextContentByQuery(page, this.url, this.querySelector)
    context.textContent = textContent
  }
}
