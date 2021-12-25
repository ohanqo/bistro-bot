import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { guards } from "@/core/guard/guard.decorator"
import { CommandInteraction } from "discord.js"
import { inject } from "inversify"
import SenderIsInChannelGuard from "./guards/sender-is-in-channel.guard"
import Player from "./player"

@command("next", "Passe à la musique suivante.")
@guards(SenderIsInChannelGuard)
export default class NextCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION) private interaction: CommandInteraction,
    @inject(Player) private player: Player
  ) {
    super()
  }

  async execute() {
    const hasSkipped = await this.player.next()
    const message = hasSkipped ? "Musique passé." : "Aucune musique suivante."
    await this.interaction.reply({ ephemeral: true, content: message })
  }
}
