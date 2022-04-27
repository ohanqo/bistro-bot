import { TYPES } from "@/core/app/app.types"
import Logger from "@/core/logger/logger"
import { inject, injectable } from "inversify"
import { Browser, Page } from "puppeteer"
import { Job } from "./jobs/job"
import PipelineContext from "./pipeline.context"

@injectable()
export default class WatcherPipeline {
  constructor(
    @inject(TYPES.LOGGER)
    private logger: Logger,
    @inject(TYPES.BROWSER)
    private browser: Browser,
    @inject(TYPES.WATCHER_PIPELINE_CONTEXT)
    private context: PipelineContext
  ) {}

  async runJobs({ jobs, errorJobs }: { jobs: Job[]; errorJobs: Job[] }): Promise<PipelineContext> {
    const page = await this.browser.newPage()

    try {
      // We don't use Promise.all as we need to catch if a job fail or not
      // With promise.all all jobs are executed even if one fail
      for (let job of jobs) {
        await job.execute(page, this.context)
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message)
        error.stack ? this.logger.error(error.stack) : null
      } else {
        this.logger.error("An error as occurred")
      }

      await this.runErrorJobs(errorJobs, page)
    } finally {
      await page.close()
      return this.context
    }
  }

  private async runErrorJobs(jobs: Job[], page: Page) {
    try {
      for (let job of jobs) {
        await job.execute(page, this.context)
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message)
        error.stack ? this.logger.error(error.stack) : null
      } else {
        this.logger.error("An error as occurred")
      }
    }
  }
}
