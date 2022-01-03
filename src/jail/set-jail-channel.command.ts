import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { guards } from "@/core/guard/guard.decorator"
import { options } from "@/core/option/option.decorator"
import { CommandInteraction } from "discord.js"
import { inject, injectable } from "inversify"
import OptionChannelIsVoiceGuard from "./guards/option-channel-is-voice.guard"
import SenderIsAdminGuard from "./guards/sender-is-admin.guard"
import JailManager from "./jail.manager"
import ChannelOption from "./options/channel.option"

@injectable()
@command("set-channel", "Définissez le channel où les prisonniers seront déplacés.")
@options(ChannelOption)
@guards(SenderIsAdminGuard, OptionChannelIsVoiceGuard)
export default class SetJailChannelCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION)
    private interaction: CommandInteraction,
    @inject(TYPES.JAIL_MANAGER)
    private jailManager: JailManager
  ) {
    super()
  }

  async execute(): Promise<void> {
    const option = new ChannelOption()
    const channel = this.interaction.options.getChannel(option.name, option.required)

    if (channel?.id == null) {
      await this.interaction.reply({
        ephemeral: true,
        content: "L'identifiant du channel n'a pas pu être trouvé…"
      })
    } else {
      await this.jailManager.setJailChannel(channel.id)
      await this.interaction.reply({
        ephemeral: true,
        content: `Channel ${channel.name} définit comme nouvelle prison.`
      })
    }
  }
}
