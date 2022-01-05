import { TYPES } from "@/core/app/app.types"
import Guard from "@/core/guard/guard"
import Logger from "@/core/logger/logger"
import { CommandInteraction, GuildMember } from "discord.js"
import { inject, injectable } from "inversify"

@injectable()
export default class SenderIsAdminGuard implements Guard {
  constructor(
    @inject(TYPES.LOGGER) private logger: Logger,
    @inject(TYPES.INTERACTION) private interaction: CommandInteraction
  ) {}

  async performValidation(): Promise<boolean> {
    const member = this.interaction.member as GuildMember
    return member?.permissions?.has("ADMINISTRATOR") ?? false
  }

  async sendValidationFailureMessage() {
    const message = "Seuls les administrateurs ont le droit d'utiliser cette commande…"
    await this.interaction.reply({ ephemeral: true, content: message })
  }
}
