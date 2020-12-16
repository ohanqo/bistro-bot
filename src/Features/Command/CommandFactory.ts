import { TYPES } from "@/App/AppTypes";
import { inject, injectable, multiInject } from "inversify";
import AbstractCommand from "./AbstractCommand";

@injectable()
export default class CommandFactory {
  constructor(
    @inject(TYPES.KEYWORD) private keyword: string,
    @multiInject(TYPES.COMMAND) private commandList: AbstractCommand[],
  ) {}

  public make(): AbstractCommand | undefined {
    return this.commandList.find((command) => this.keyword === command.keyword);
  }
}
