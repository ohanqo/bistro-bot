import { TYPES } from "@/core/app/app.types"
import { ContainerModule, interfaces } from "inversify"
import CreateWatcherListCommand from "./commands/create-watcher-list.command"
import CreateWatcherCommand from "./commands/create-watcher.command"
import DeleteWatcherCommand from "./commands/delete-watcher.command"
import ListWatcherCommand from "./commands/list-watcher.command"
import RefreshWatcherCommand from "./commands/refresh-watcher.command"
import PipelineContext from "./pipeline.context"
import WatcherPipeline from "./watcher.pipeline"
import WatcherScheduler from "./watcher.scheduler"

const watcherModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.COMMAND).to(CreateWatcherCommand)
  bind(TYPES.COMMAND).to(CreateWatcherListCommand)
  bind(TYPES.COMMAND).to(DeleteWatcherCommand)
  bind(TYPES.COMMAND).to(ListWatcherCommand)
  bind(TYPES.COMMAND).to(RefreshWatcherCommand)
  bind(TYPES.WATCHER_PIPELINE).to(WatcherPipeline)
  bind(TYPES.WATCHER_PIPELINE_CONTEXT).to(PipelineContext)
  bind(TYPES.WATCHER_SCHEDULER).to(WatcherScheduler).inSingletonScope()
})

export { watcherModule }
