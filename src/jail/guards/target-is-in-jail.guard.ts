import { TYPES } from "@/core/app/app.types"
import Guard from "@/core/guard/guard"
import Logger from "@/core/logger/logger"
import { CommandInteraction, GuildMember } from "discord.js"
import { inject, injectable } from "inversify"
import { jailInfo } from "../jail.info"
import MemberOption from "../options/member.option"

@injectable()
export default class TargetIsInJailGuard implements Guard {
  constructor(
    @inject(TYPES.LOGGER) private logger: Logger,
    @inject(TYPES.INTERACTION) private interaction: CommandInteraction
  ) {}

  async performValidation(): Promise<boolean> {
    const key = new MemberOption().name
    const target = this.interaction.options.getMember(key) as GuildMember | null

    if (target === null) {
      return true
    } else {
      const isJailed = target.roles.cache.some((role) => role.name === jailInfo.name)
      this.logger.info(`[JAIL] ${target.displayName} has jail role ? ${isJailed}`)
      return isJailed
    }
  }

  async sendValidationFailureMessage() {
    const message = "Cette personne n'est pas en prison…"
    await this.interaction.reply({ ephemeral: true, content: message })
  }
}
