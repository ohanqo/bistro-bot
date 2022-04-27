import { Container } from "inversify"
import { browserModule } from "./core/app/app.browser"
import { databaseModule } from "./core/app/app.database"
import { jailModule } from "./jail/jail.module"
import { jukeboxModule } from "./jukebox/jukebox.module"
import { loggerModule } from "./logger/logger.module"
import { reminderModule } from "./reminder/reminder.module"
import { watcherModule } from "./watcher/watcher.module"

const appContainer: Promise<Container> = new Promise(async (resolve) => {
  const container = new Container()
  await container.loadAsync(databaseModule, browserModule)
  container.load(jailModule, jukeboxModule, reminderModule, loggerModule, watcherModule)
  resolve(container)
})

export { appContainer }
