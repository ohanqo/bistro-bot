import { Page } from "puppeteer"
import PipelineContext from "../pipeline.context"
import { Job } from "./job"

export default class CheckChangeJob implements Job {
  constructor(private watcherId: number, private storedTextContent: string) {}

  async execute(_: Page, context: PipelineContext): Promise<void> {
    const hasChanged = context.textContent?.toLowerCase() !== this.storedTextContent?.toLowerCase()
    if (hasChanged) context.logger.info(`[WATCHER] job with id ${this.watcherId} changed`)
    context.hasContentChanged = hasChanged
  }
}
