import { TYPES } from "@/core/app/app.types"
import Guard from "@/core/guard/guard"
import Logger from "@/core/logger/logger"
import { CommandInteraction, GuildMember } from "discord.js"
import { inject, injectable } from "inversify"
import { jailInfo } from "../jail.info"
import MemberOption from "../options/member.option"

@injectable()
export default class TargetIsNotInJailGuard implements Guard {
  constructor(
    @inject(TYPES.LOGGER) private logger: Logger,
    @inject(TYPES.INTERACTION) private interaction: CommandInteraction
  ) {}

  async performValidation(): Promise<boolean> {
    const key = new MemberOption().name
    const target = this.interaction.options.getMember(key) as GuildMember
    const isNotJailed = target.roles.cache.some((role) => role.name !== jailInfo.name)
    this.logger.info(`[JAIL] ${target.displayName} has jail role ? ${!isNotJailed}`)
    return isNotJailed
  }

  async sendValidationFailureMessage() {
    const message = "Cette personne est déjà en prison…"
    await this.interaction.reply({ ephemeral: true, content: message })
  }
}
