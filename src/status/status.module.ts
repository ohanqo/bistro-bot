import { TYPES } from "@/core/app/app.types"
import { ContainerModule, interfaces } from "inversify"
import StatusCommand from "./status.command"

const statusModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.COMMAND).to(StatusCommand)
})

export { statusModule }
