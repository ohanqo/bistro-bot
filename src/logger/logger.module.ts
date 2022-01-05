import { TYPES } from "@/core/app/app.types"
import { ContainerModule, interfaces } from "inversify"
import LoggerCommand from "./logger.command"

const loggerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind(TYPES.COMMAND).to(LoggerCommand)
})

export { loggerModule }
