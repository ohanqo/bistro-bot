import { TYPES } from "@/core/app/app.types"
import { ContainerModule, interfaces } from "inversify"
import SenderIsInChannelGuard from "./guards/sender-is-in-channel.guard"
import NextCommand from "./next.command"
import PauseCommand from "./pause.command"
import PlayCommand from "./play.command"
import Player from "./player"
import QueueCommand from "./queue.command"
import ResumeCommand from "./resume.command"
import StopCommand from "./stop.command"

const jukeboxModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.COMMAND).to(PlayCommand)
  bind(TYPES.COMMAND).to(StopCommand)
  bind(TYPES.COMMAND).to(NextCommand)
  bind(TYPES.COMMAND).to(PauseCommand)
  bind(TYPES.COMMAND).to(ResumeCommand)
  bind(TYPES.COMMAND).to(QueueCommand)
  bind(SenderIsInChannelGuard).toSelf()
  bind(Player).toSelf().inSingletonScope()
})

export { jukeboxModule }
