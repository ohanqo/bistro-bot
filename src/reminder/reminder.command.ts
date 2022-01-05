import "@/core/app/app.extensions"
import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { options } from "@/core/option/option.decorator"
import * as chrono from "chrono-node"
import { CommandInteraction, TextChannel } from "discord.js"
import { inject } from "inversify"
import { Repository } from "typeorm"
import DateOption from "./options/date.option"
import MessageOption from "./options/message.option"
import PrivateOption from "./options/private.option"
import ReminderEntity from "./reminder.entity"
import ReminderScheduler from "./reminder.scheduler"

@command("reminder", "Te rapelle d'un message à une date donnée.")
@options(MessageOption, DateOption, PrivateOption)
export default class ReminderCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION)
    private interaction: CommandInteraction,
    @inject(TYPES.REMINDER_SCHEDULER)
    private reminderScheduler: ReminderScheduler
  ) {
    super()
  }

  /**
   * TODO: save en db, récup l'id, start bree avec en param l'id
   * dans le worker, recuperer les elements du reminder avec l'id
   * checker si on peut se connecter au client discord (via le container ??)
   */
  public async execute(): Promise<void> {
    const optionDate = this.interaction.options.getString(new DateOption().name) ?? ""
    const parsedDate = chrono.fr.parseDate(optionDate)

    if (parsedDate === null) {
      await this.interaction.reply({
        ephemeral: true,
        content: "La date n'est pas valide…"
      })
    } else if (parsedDate.isInPast()) {
      await this.interaction.reply({
        ephemeral: true,
        content: "La date ne peut être dans le passé…"
      })
    } else {
      const isPrivate = this.interaction.options.getBoolean(new PrivateOption().name) ?? false
      const memberId = this.interaction.member?.user.id ?? ""
      const message = this.interaction.options.getString(new MessageOption().name) ?? ""
      const channel = this.interaction.channel as TextChannel
      const entity = ReminderEntity.factory({
        message: message,
        isPrivate: isPrivate,
        memberId: memberId,
        date: parsedDate,
        channelId: channel?.id ?? "undefined",
        guildId: channel?.guild?.id ?? "undefined"
      })

      await this.reminderScheduler.scheduleJob(entity)

      await this.interaction.reply({
        ephemeral: isPrivate,
        content: `Nouveau rappel: ${message} \n Date: ${parsedDate}`
      })
    }
  }
}
