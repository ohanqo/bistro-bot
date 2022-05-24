import { TYPES } from "@/core/app/app.types"
import Command from "@/core/command/command"
import { command } from "@/core/command/command.decorator"
import { options } from "@/core/option/option.decorator"
import { Client, CommandInteraction } from "discord.js"
import { inject } from "inversify"
import StatusOption from "./options/status.option"
import TypeOption from "./options/type.option"

@command("status", "Modifie le status du bot. Affiche la version par défaut.")
@options(StatusOption, TypeOption)
export default class StatusCommand extends Command {
  constructor(
    @inject(TYPES.INTERACTION)
    private interaction: CommandInteraction,
    @inject(TYPES.CLIENT)
    private client: Client
  ) {
    super()
  }

  public async execute(): Promise<void> {
    try {
      const status = this.interaction.options.getString(new StatusOption().name)
      const type = this.interaction.options.getInteger(new TypeOption().name)

      if (!status) {
        this.setBotVersionAsStatus()
      } else {
        this.client.user?.setActivity(status, { type: type ?? undefined })
      }

      await this.interaction.reply({ ephemeral: true, content: "Status mis à jour." })
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message)
      }

      await this.interaction.reply({
        ephemeral: true,
        content: "Une erreur est survenue lors de la modification du status…"
      })
    }
  }

  private setBotVersionAsStatus() {
    const version = process.env.npm_package_version
    this.client.user?.setActivity(`la version ${version}`, { type: "WATCHING" })
  }
}
