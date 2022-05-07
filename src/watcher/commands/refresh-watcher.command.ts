import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { CommandInteraction } from "discord.js"
import { inject } from "inversify"
import WatcherScheduler from "../watcher.scheduler"

@command("watcher-refresh", "Rafraîchit l'ensemble des watchers.")
export default class RefreshWatcherCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION)
    private interaction: CommandInteraction,
    @inject(TYPES.WATCHER_SCHEDULER)
    private scheduler: WatcherScheduler
  ) {
    super()
  }

  async execute(): Promise<void> {
    try {
      await this.scheduler.refreshAndRescheduleJobs()
      await this.interaction.reply({ ephemeral: true, content: "Les watchers ont été relancés." })
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message)
      }

      await this.interaction.reply({
        ephemeral: true,
        content: "Une erreur est survenue. Impossible de rafraîchir les watchers."
      })
    }
  }
}
