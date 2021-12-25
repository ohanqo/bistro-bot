import { injectable } from "inversify"
import CommandFactory from "./command.factory"

@injectable()
export default class CommandCoordinator {
  constructor(private factory: CommandFactory) {}

  public async manage() {
    const command = this.factory.make()

    ;(await command?.runGuards()) && (await command?.execute())
  }
}
