import { TYPES } from "@/App/AppTypes";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import AbstractCommand from "../AbstractCommand";
import WebWatcherArgumentValidator from "./WebWatcherArgumentValidator";
import WebWatcherIntegrityCheck from "./WebWatcherIntegrityCheck";

@injectable()
export default class WebWatcherCommand extends AbstractCommand {
  public keyword = "watch";

  constructor(
    @inject(TYPES.MESSAGE)
    private message: Message,
    @inject(TYPES.WATCHER_ARGS_VALIDATOR)
    argsValidator: WebWatcherArgumentValidator,
    @inject(TYPES.WATCHER_INTEGRITY_CHECK)
    private integrityChecker: WebWatcherIntegrityCheck,
  ) {
    super();
    this.validators = [argsValidator];
  }

  public async execute() {
    if (await this.integrityChecker.check()) {
      await this.message.channel.send("Ok…");
    }
  }
}
