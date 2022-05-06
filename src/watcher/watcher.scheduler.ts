import { TYPES } from "@/core/app/app.types"
import { coreContainer } from "@/core/core.container"
import Logger from "@/core/logger/logger"
import { inject, injectable } from "inversify"
import { scheduleJob } from "node-schedule"
import { Repository } from "typeorm"
import CheckChangeJob from "./jobs/check-change.job"
import NotifyOnChangeJob from "./jobs/notify-on-change.job"
import PerformWatchOnListJob from "./jobs/perform-watch-list.job"
import PerformWatchJob from "./jobs/perform-watch.job"
import UpdateWatcherJob from "./jobs/update-watcher.job"
import WatcherEntity from "./watcher.entity"
import WatcherPipeline from "./watcher.pipeline"

@injectable()
export default class WatcherScheduler {
  constructor(
    @inject(TYPES.LOGGER) private logger: Logger,
    @inject(TYPES.WATCHER_REPO) private repository: Repository<WatcherEntity>
  ) {}

  public async scheduleNewJob(watcher: WatcherEntity) {
    const savedEntity = await this.repository.save(watcher)
    await this.scheduleJob(savedEntity)
  }

  public async scheduleStoredJobs() {
    const watchers = await this.repository.find()
    watchers.forEach((watcher) => this.scheduleJob(watcher))
  }

  private async scheduleJob(watcherEntity: WatcherEntity) {
    this.logger.info(`[WATCHER] schedule job with id ${watcherEntity.id}`)

    scheduleJob(
      watcherEntity.recurrence,
      function (watcherId: number, self: WatcherScheduler) {
        self.onJobStart(watcherId)
      }.bind(null, watcherEntity.id, this)
    )
  }

  /**
   * TODO
   * - Gestion des cookies
   * - Gestion du cache
   * @param watcher
   */
  private async onJobStart(watcherId: number) {
    try {
      const watcher = (await this.repository.findOne(watcherId))!
      const { id, url, elementQuerySelector, elementTextContent, cookie, isWatcherList } = watcher
      const pipeline = coreContainer.get<WatcherPipeline>(TYPES.WATCHER_PIPELINE)

      await pipeline.runJobs({
        jobs: [
          isWatcherList
            ? new PerformWatchOnListJob(url, elementQuerySelector, cookie)
            : new PerformWatchJob(url, elementQuerySelector, cookie),
          new CheckChangeJob(id, elementTextContent),
          new UpdateWatcherJob(id),
          new NotifyOnChangeJob(watcher)
        ],
        errorJobs: []
      })
    } catch (error) {
      this.logger.error(`[WATCHER] an error as occurred with job ${watcherId}`)
      if (error instanceof Error) {
        this.logger.error(error.message)
      }
    }
  }
}
