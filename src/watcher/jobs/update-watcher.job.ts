import { TYPES } from "@/core/app/app.types"
import { coreContainer } from "@/core/core.container"
import { Page } from "puppeteer"
import { Repository } from "typeorm"
import PipelineContext from "../pipeline.context"
import WatcherEntity from "../watcher.entity"
import { Job } from "./job"

export default class UpdateWatcherJob implements Job {
  constructor(private watcherId: number) {}

  async execute(_: Page, context: PipelineContext): Promise<void> {
    if (context.hasContentChanged == null || context.hasContentChanged == false) return
    const repository = coreContainer.get<Repository<WatcherEntity>>(TYPES.WATCHER_REPO)
    await repository.update(this.watcherId, { elementTextContent: context.textContent ?? "" })
    context.logger.info(`[WATCHER] job with id ${this.watcherId} updated`)
  }
}
