import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { guards } from "@/core/guard/guard.decorator"
import { CommandInteraction } from "discord.js"
import { inject } from "inversify"
import SenderIsInChannelGuard from "./guards/sender-is-in-channel.guard"
import Player from "./player"

@command("queue", "Affiche la liste d'attente.")
@guards(SenderIsInChannelGuard)
export default class QueueCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION) private interaction: CommandInteraction,
    @inject(Player) private player: Player
  ) {
    super()
  }

  public async execute(): Promise<void> {
    const queue = this.player.getFormattedQueue()
    await this.interaction.reply({ ephemeral: true, content: queue })
  }
}
