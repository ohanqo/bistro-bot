import { TYPES } from "@/core/app/app.types"
import Guard from "@/core/guard/guard"
import Logger from "@/core/logger/logger"
import { CommandInteraction, GuildMember } from "discord.js"
import { inject, injectable } from "inversify"
import MemberOption from "../options/member.option"

@injectable()
export default class TargetIsNonAdminGuard implements Guard {
  constructor(
    @inject(TYPES.LOGGER) private logger: Logger,
    @inject(TYPES.INTERACTION) private interaction: CommandInteraction
  ) {}

  async performValidation(): Promise<boolean> {
    const key = new MemberOption().name
    const target = this.interaction.options.getMember(key) as GuildMember
    const isAdmin = target?.permissions?.has("ADMINISTRATOR") ?? false
    return !isAdmin
  }

  async sendValidationFailureMessage() {
    const message = "Tu ne peux pas mettre en prison des administrateurs…"
    await this.interaction.reply({ ephemeral: true, content: message })
  }
}
