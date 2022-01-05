import ReminderScheduler from "@/reminder/reminder.scheduler"
import { inject, injectable } from "inversify"
import DiscordClient from "../discord/discord.client"
import { TYPES } from "./app.types"

@injectable()
export default class App {
  constructor(
    private discordClient: DiscordClient,
    @inject(TYPES.REMINDER_SCHEDULER)
    private reminderScheduler: ReminderScheduler
  ) {}

  public async startDiscord(token: string | undefined) {
    this.discordClient.registerHandlers()
    await this.discordClient.login(token)
    await this.discordClient.refreshCommands(token)
  }

  public async scheduleStoredReminders() {
    await this.reminderScheduler.scheduleStoredJobs()
  }
}
