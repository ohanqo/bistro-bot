import { TYPES } from "@/core/app/app.types"
import Logger from "@/core/logger/logger"
import { Client } from "discord.js"
import { inject, injectable } from "inversify"
import { scheduleJob } from "node-schedule"
import { Repository } from "typeorm"
import ReminderEntity from "./reminder.entity"

@injectable()
export default class ReminderScheduler {
  constructor(
    @inject(TYPES.LOGGER) private logger: Logger,
    @inject(TYPES.CLIENT) private client: Client,
    @inject(TYPES.REMINDER_REPO) private repository: Repository<ReminderEntity>
  ) {}

  public async scheduleJob(reminderEntity: ReminderEntity) {
    const savedEntity = await this.repository.save(reminderEntity)
    this.logger.info(`[REMINDER] schedule job with id ${savedEntity.id}`)

    scheduleJob(
      reminderEntity.date,
      function (reminder: ReminderEntity, self: ReminderScheduler) {
        self.onJobStart(reminder)
      }.bind(null, savedEntity, this)
    )
  }

  public async scheduleStoredJobs() {
    const reminders = await this.repository.find()
    reminders.forEach((reminder) => this.scheduleJob(reminder))
  }

  private async onJobStart(reminder: ReminderEntity) {
    try {
      this.logger.info(`[REMINDER] job with id ${reminder.id} started`)
      if (reminder.isPrivate) {
        await this.sendPrivateMessage(reminder)
      } else {
        await this.sendPublicChannelMessage(reminder)
      }
      this.logger.info(`[REMINDER] job finished`)
    } catch (error) {
      this.logger.error(`[REMINDER] an error as occurred with job ${reminder.id}`)

      if (error instanceof Error) {
        this.logger.error(error.message)
      }
    } finally {
      this.logger.info(`[REMINDER] job with id ${reminder.id} soft deleted`)
      await this.repository.softDelete(reminder.id)
    }
  }

  private async sendPublicChannelMessage(reminder: ReminderEntity) {
    const potentialChannel = this.client.findChannel(reminder.guildId, reminder.channelId)
    await potentialChannel?.send(reminder.message)
  }

  private async sendPrivateMessage(reminder: ReminderEntity) {
    const member = this.client.findMember(reminder.guildId, reminder.memberId)
    await member?.send(reminder.message)
  }
}
