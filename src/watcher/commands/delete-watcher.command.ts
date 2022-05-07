import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { options } from "@/core/option/option.decorator"
import { CommandInteraction } from "discord.js"
import { inject } from "inversify"
import { Repository } from "typeorm"
import WatcherEntity from "../watcher.entity"
import WatcherIdOption from "./options/watcher-id.option"

@command("watcher-delete", "Supprime un watcher via son identifiant.")
@options(WatcherIdOption)
export default class DeleteWatcherCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION)
    private interaction: CommandInteraction,
    @inject(TYPES.WATCHER_REPO)
    private repository: Repository<WatcherEntity>
  ) {
    super()
  }

  async execute(): Promise<void> {
    try {
      const id = this.interaction.options.getInteger(new WatcherIdOption().name, true)
      await this.repository.softDelete(id)
      await this.interaction.reply({ ephemeral: true, content: "Watcher supprimé." })
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message)
      }

      await this.interaction.reply({
        ephemeral: true,
        content: "Une erreur est survenue. Impossible de supprimer le watcher."
      })
    }
  }
}
