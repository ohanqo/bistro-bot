import { TYPES } from "@/App/AppTypes";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import CommandFactory from "./CommandFactory";

@injectable()
export default class CommandHandler {
  constructor(
    @inject(TYPES.MESSAGE) private message: Message,
    @inject(TYPES.COMMAND_FACTORY) private factory: CommandFactory,
  ) {}

  public async handle() {
    try {
      await this.factory.make()?.run();
    } catch (error) {
      console.error(error);
      this.message.channel.send(error.message);
    }
  }
}
