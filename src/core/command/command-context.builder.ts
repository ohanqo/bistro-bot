import { BaseCommandInteraction } from "discord.js"
import { Container, inject, injectable } from "inversify"
import { Logger } from "winston"
import { TYPES } from "../app/app.types"
import { coreContainer } from "../core.container"

@injectable()
export default class CommandContextBuilder {
  constructor(@inject(TYPES.LOGGER) private logger: Logger) {}

  public build(interaction: BaseCommandInteraction): Container {
    this.logger.info("")
    this.logger.info(`[COMMAND] name: ${interaction.commandName}`)
    this.logger.info(`[COMMAND] author: ${interaction.user.username}`)
    coreContainer.rebind(TYPES.INTERACTION).toConstantValue(interaction)
    return coreContainer
  }

  public destroy() {
    this.logger.info("")
  }
}
