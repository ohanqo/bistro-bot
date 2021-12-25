import JailEntity from "@/jail/jail.entity"
import ReminderEntity from "@/reminder/reminder.entity"
import { AsyncContainerModule, interfaces } from "inversify"
import { createConnection, getConnection, getConnectionManager } from "typeorm"
import { TYPES } from "./app.types"

const databaseModule = new AsyncContainerModule(async (bind: interfaces.Bind) => {
  const manager = getConnectionManager()
  const connection = manager.has("default")
    ? getConnection()
    : await createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: false,
        entities: ["dist/**/*.entity.js"],
        migrations: ["dist/core/app/migrations/*.js"],
        migrationsRun: true,
        ssl: false
      })

  const jailRepository = connection.getRepository(JailEntity)
  const reminderRepository = connection.getRepository(ReminderEntity)

  bind(TYPES.DATABASE).toConstantValue(connection)
  bind(TYPES.JAIL_REPO).toConstantValue(jailRepository)
  bind(TYPES.REMINDER_REPO).toConstantValue(reminderRepository)
})

export { databaseModule }
