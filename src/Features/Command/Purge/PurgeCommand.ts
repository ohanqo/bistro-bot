import { TYPES } from "@/App/AppTypes";
import { Message, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import AbstractCommand from "../AbstractCommand";
import PurgeArgumentValidator from "./PurgeArgumentValidator";

@injectable()
export default class PurgeCommand extends AbstractCommand {
  public keyword = "purge";

  constructor(
    @inject(TYPES.MESSAGE) private message: Message,
    @inject(TYPES.PURGE_ARGS_VALIDATOR) argsValidator: PurgeArgumentValidator,
  ) {
    super();
    this.validators = [argsValidator];
  }

  public async execute() {
    try {
      const argument = Number(this.message.content.split(" ")[1]) + 1;
      await (this.message.channel as TextChannel).bulkDelete(argument);
      await (await this.message.reply("les messages ont été supprimés")).delete({ timeout: 3000 });
    } catch (error) {
      console.error("[PURGE] — An error occurred while executing purge command…", error);

      const message =
        error instanceof Error ? error.message.toLowerCase() : "Une erreur est survenue…";
      await this.message.react("❌");
      await this.message.reply(message);
    }
  }
}
