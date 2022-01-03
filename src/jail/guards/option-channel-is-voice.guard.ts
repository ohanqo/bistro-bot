import { TYPES } from "@/core/app/app.types"
import Guard from "@/core/guard/guard"
import Logger from "@/core/logger/logger"
import { CommandInteraction, GuildMember } from "discord.js"
import { inject, injectable } from "inversify"
import ChannelOption from "../options/channel.option"

@injectable()
export default class OptionChannelIsVoiceGuard implements Guard {
  constructor(@inject(TYPES.INTERACTION) private interaction: CommandInteraction) {}

  async performValidation(): Promise<boolean> {
    const channel = this.interaction.options.getChannel(new ChannelOption().name, true)
    return channel.type == "GUILD_VOICE"
  }

  async sendValidationFailureMessage() {
    const message = "Le channel spécifié doit être de type vocal !"
    await this.interaction.reply({ ephemeral: true, content: message })
  }
}
