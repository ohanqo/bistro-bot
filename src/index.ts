import "dotenv/config"
import "module-alias/register"
import "reflect-metadata"
import { appContainer } from "./app.container"
import AppFactory from "./core/app/app.factory"
import Logger from "./core/logger/logger"

export async function bootstrap() {
  const app = await AppFactory.create(appContainer)
  await app.startDiscord(process.env.DISCORD_CLIENT_ID)
  await app.scheduleStoredReminders()
  new Logger().info("App started")
}

bootstrap()
