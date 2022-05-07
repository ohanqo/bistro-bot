import { CommandInteraction } from "discord.js"
import { inject, injectable } from "inversify"
import { TYPES } from "../app/app.types"
import { coreContainer } from "../core.container"
import Guard from "../guard/guard"
import Logger from "../logger/logger"
import Option from "../option/option"

@injectable()
export default abstract class Command {
  keyword: string = "undefined"
  description: string = "undefined"
  options: Option[] = []
  guards: (new () => Guard)[] = []

  protected logger: Logger

  constructor() {
    this.logger = coreContainer.get<Logger>(TYPES.LOGGER)
  }

  abstract execute(): Promise<void>

  public async runGuards(): Promise<boolean> {
    for (let guardType of this.guards) {
      const guard = coreContainer.get<Guard>(guardType)
      const isValid = await guard.performValidation()

      if (!isValid) {
        await guard.sendValidationFailureMessage()
        return false
      }
    }

    return true
  }

  protected getCommandOptions(interaction: CommandInteraction): any {
    const options: { [key: string]: any } = {}
    this.options.forEach((option) => {
      options[option.name] = interaction.options.get(option.name, option.required.valueOf())?.value
    })
    return options
  }
}
