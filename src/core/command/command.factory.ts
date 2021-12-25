import { BaseCommandInteraction } from "discord.js"
import { inject, injectable, multiInject } from "inversify"
import { TYPES } from "../app/app.types"
import Command from "./command"

@injectable()
export default class CommandFactory {
  constructor(
    @multiInject(TYPES.COMMAND) private commands: Command[],
    @inject(TYPES.INTERACTION) private interaction: BaseCommandInteraction
  ) {}

  public make(): Command | undefined {
    return this.commands.find((command) => command.keyword === this.interaction.commandName)
  }
}
