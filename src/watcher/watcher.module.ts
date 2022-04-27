import { TYPES } from "@/core/app/app.types"
import { ContainerModule, interfaces } from "inversify"
import CreateWatcherCommand from "./create-watcher.command"
import PipelineContext from "./pipeline.context"
import WatcherPipeline from "./watcher.pipeline"
import WatcherScheduler from "./watcher.scheduler"

const watcherModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.COMMAND).to(CreateWatcherCommand)
  bind(TYPES.WATCHER_PIPELINE).to(WatcherPipeline)
  bind(TYPES.WATCHER_PIPELINE_CONTEXT).to(PipelineContext)
  bind(TYPES.WATCHER_SCHEDULER).to(WatcherScheduler).inSingletonScope()
})

export { watcherModule }
