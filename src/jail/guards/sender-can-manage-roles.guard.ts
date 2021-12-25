import { TYPES } from "@/core/app/app.types"
import Guard from "@/core/guard/guard"
import Logger from "@/core/logger/logger"
import { CommandInteraction, GuildMember } from "discord.js"
import { inject, injectable } from "inversify"

@injectable()
export default class SenderCanManageRolesGuard implements Guard {
  constructor(
    @inject(TYPES.LOGGER) private logger: Logger,
    @inject(TYPES.INTERACTION) private interaction: CommandInteraction
  ) {}

  async performValidation(): Promise<boolean> {
    const sender = this.interaction.member as GuildMember
    const canManageRoles = sender.permissions.has("MANAGE_ROLES")
    this.logger.info(
      `[${this.interaction.commandName.toUpperCase()}] ${
        sender.displayName
      } can manage roles ? ${canManageRoles}`
    )
    return canManageRoles
  }

  async sendValidationFailureMessage() {
    const message = "Tu n'as pas les droits nécessaires pour effectuer cette action…"
    await this.interaction.reply({ ephemeral: true, content: message })
  }
}
