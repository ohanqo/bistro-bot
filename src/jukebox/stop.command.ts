import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { guards } from "@/core/guard/guard.decorator"
import { CommandInteraction } from "discord.js"
import { inject } from "inversify"
import SenderIsInChannelGuard from "./guards/sender-is-in-channel.guard"
import Player from "./player"

@command("stop", "Stop la musique et déconnecte le bot.")
@guards(SenderIsInChannelGuard)
export default class StopCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION) private interaction: CommandInteraction,
    @inject(Player) private player: Player
  ) {
    super()
  }

  async execute() {
    this.player.stop()
    await this.interaction.guild?.me?.voice.disconnect()
    await this.interaction.reply({ ephemeral: true, content: "Le bot a été déconnecté." })
  }
}
