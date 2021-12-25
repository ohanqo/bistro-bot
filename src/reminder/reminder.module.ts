import { TYPES } from "@/core/app/app.types"
import { ContainerModule, interfaces } from "inversify"
import ReminderCommand from "./reminder.command"

const reminderModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.COMMAND).to(ReminderCommand)
})

export { reminderModule }
