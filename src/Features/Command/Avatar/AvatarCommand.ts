import { TYPES } from "@/App/AppTypes";
import { Client, Message } from "discord.js";
import { inject, injectable } from "inversify";
import AbstractCommand from "../AbstractCommand";

@injectable()
export default class AvatarCommand extends AbstractCommand {
  public keyword = "avatar";

  constructor(
    @inject(TYPES.CLIENT) private client: Client,
    @inject(TYPES.MESSAGE) private message: Message,
  ) {
    super();
  }

  public async execute() {
    try {
      const URL = this.message.content.split(" ")[1];
      await this.client.user?.setAvatar(URL);
      await this.message.react("✅");
    } catch (error) {
      console.error("[AVATAR] — An error as occurred while changing bot avatar…", error);

      const message =
        error instanceof Error ? error.message.toLowerCase() : "Une erreur est survenue…";
      await this.message.react("❌");
      await this.message.reply(message);
    }
  }
}
