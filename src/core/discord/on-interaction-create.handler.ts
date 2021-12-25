import { CommandInteraction, Interaction } from "discord.js"
import { inject } from "inversify"
import CommandContextBuilder from "../command/command-context.builder"
import CommandCoordinator from "../command/command.coordinator"
import Logger from "../logger/logger"
import DiscordHandler from "./discord.handler"
import { event } from "./event.decorator"

@event("interactionCreate")
export default class OnInteractionCreateHandler implements DiscordHandler {
  constructor(@inject(CommandContextBuilder) private contextBuilder: CommandContextBuilder) {}

  async handle(interaction: Interaction): Promise<void> {
    if (interaction.isCommand()) {
      try {
        const container = this.contextBuilder.build(interaction)
        await container.get(CommandCoordinator).manage()
        this.contextBuilder.destroy()
      } catch (error) {
        await this.handleExceptions(error, interaction)
      }
    }
  }

  private async handleExceptions(error: unknown, interaction: CommandInteraction) {
    if (error instanceof Error) {
      new Logger().error(error.message)
      await interaction.reply({ ephemeral: true, content: error.message })
    }
  }
}
