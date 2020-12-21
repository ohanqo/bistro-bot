import { TYPES } from "@/App/AppTypes";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import AbstractCommand from "../AbstractCommand";
import WebsiteWatcherArgumentValidator from "./WebsiteWatcherArgumentValidator";
import WebsiteWatcherIntegrityCheck from "./WebsiteWatcherIntegrityCheck";

@injectable()
export default class WebsiteWatcherCommand extends AbstractCommand {
  public keyword = "watch";

  constructor(
    @inject(TYPES.MESSAGE)
    private message: Message,
    @inject(TYPES.WATCHER_ARGS_VALIDATOR)
    argsValidator: WebsiteWatcherArgumentValidator,
    @inject(TYPES.WATCHER_INTEGRITY_CHECK)
    private integrityChecker: WebsiteWatcherIntegrityCheck,
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
