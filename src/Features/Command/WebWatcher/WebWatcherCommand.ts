import { TYPES } from "@/App/AppTypes";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import AbstractCommand from "../AbstractCommand";
import WebWatcherArgumentValidator from "./WebWatcherArgumentValidator";

@injectable()
export default class WebWatcherCommand extends AbstractCommand {
  public keyword = "watch";

  constructor(
    @inject(TYPES.MESSAGE)
    private message: Message,
    @inject(TYPES.WATCHER_ARGS_VALIDATOR)
    private argsValidator: WebWatcherArgumentValidator,
  ) {
    super();
    this.validators = [argsValidator];
  }

  public async execute() {
    await this.message.channel.send("Ok…");
  }
}
