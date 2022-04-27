import "dotenv/config"
import "module-alias/register"
import "reflect-metadata"
import "@/core/app/app.extensions"
import "@/core/browser/browser.extensions"
import "@/core/discord/discord.extensions"
import { appContainer } from "./app.container"
import AppFactory from "./core/app/app.factory"
import Logger from "./core/logger/logger"

export async function bootstrap() {
  const app = await AppFactory.create(appContainer)
  await app.startDiscord(process.env.DISCORD_CLIENT_ID)
  await app.scheduleStoredReminders()
  await app.scheduleStoredWatchers()
  new Logger().info("App started")
}

bootstrap()
