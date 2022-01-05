import { TYPES } from "@/core/app/app.types"
import { ContainerModule, interfaces } from "inversify"
import ReminderCommand from "./reminder.command"
import ReminderScheduler from "./reminder.scheduler"

const reminderModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.COMMAND).to(ReminderCommand)
  bind(TYPES.REMINDER_SCHEDULER).to(ReminderScheduler).inSingletonScope()
})

export { reminderModule }
