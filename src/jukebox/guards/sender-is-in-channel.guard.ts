import { TYPES } from "@/core/app/app.types"
import Guard from "@/core/guard/guard"
import Logger from "@/core/logger/logger"
import { CommandInteraction, GuildMember } from "discord.js"
import { inject, injectable } from "inversify"

@injectable()
export default class SenderIsInChannelGuard implements Guard {
  constructor(
    @inject(TYPES.LOGGER) private logger: Logger,
    @inject(TYPES.INTERACTION) private interaction: CommandInteraction
  ) {}

  async performValidation(): Promise<boolean> {
    const sender = this.interaction.member as GuildMember
    const senderIsInVoiceChannel = sender.isInVoiceChannel()
    this.logger.info(`[GUARD] ${sender.displayName} is in voice channel ? ${senderIsInVoiceChannel}`)
    return senderIsInVoiceChannel
  }

  async sendValidationFailureMessage() {
    const message = "Tu dois être dans un channel vocal pour pouvoir utiliser le jukebox…"
    await this.interaction.reply({ ephemeral: true, content: message })
  }
}
