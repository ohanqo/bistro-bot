import { Container } from "inversify"
import { databaseModule } from "./core/app/app.database"
import { jailModule } from "./jail/jail.module"
import { jukeboxModule } from "./jukebox/jukebox.module"
import { reminderModule } from "./reminder/reminder.module"

const appContainer: Promise<Container> = new Promise(async (resolve) => {
  const container = new Container()
  await container.loadAsync(databaseModule)
  container.load(jailModule, jukeboxModule, reminderModule)
  resolve(container)
})

export { appContainer }
