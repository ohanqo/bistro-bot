import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { CommandInteraction, MessageEmbed } from "discord.js"
import { inject } from "inversify"
import { Repository } from "typeorm"
import WatcherEntity from "../watcher.entity"

@command("watcher-list", "Liste l'ensemble de tes watchers privés et ceux qui sont publiques.")
export default class ListWatcherCommand extends Command {
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
      const memberId = this.interaction.member?.user.id
      const watchers = await this.repository
        .createQueryBuilder("watcher")
        .where("watcher.is_private = false")
        .orWhere("watcher.member_id = :memberId", { memberId })
        .getMany()

      const embeds = watchers.map((watcher) => this.createEmbedMessage(watcher))
      // chunks embeds as we can only send 10 embeds per message
      const chunks = embeds.chunk(10)
      await this.interaction.reply({ ephemeral: true, embeds: chunks[0] })

      if (chunks.length > 0) {
        for (let i = 1; i < chunks.length; i++) {
          const chunk = chunks[i]
          await this.interaction.followUp({ ephemeral: true, embeds: chunk })
        }
      }
    } catch (error) {
      await this.interaction.reply({
        ephemeral: true,
        content: "Une erreur est survenue. Impossible de récupérer les watchers"
      })
    }
  }

  private createEmbedMessage(watcher: WatcherEntity): MessageEmbed {
    const message = new MessageEmbed()
    message.setTitle(watcher.title ?? "Pas de titre")
    return message
  }
}
