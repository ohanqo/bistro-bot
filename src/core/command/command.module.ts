import { ContainerModule, interfaces } from "inversify"
import CommandContextBuilder from "./command-context.builder"
import CommandCoordinator from "./command.coordinator"
import CommandFactory from "./command.factory"

const commandModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(CommandContextBuilder).toSelf()
  bind(CommandFactory).toSelf()
  bind(CommandCoordinator).toSelf()
})

export { commandModule }
