import { TYPES } from "@/App/AppTypes";
import { Client, Message } from "discord.js";
import { inject, injectable } from "inversify";
import AbstractCommand from "../AbstractCommand";
import AvatarErrorHandler from "./AvatarErrorHandler";

@injectable()
export default class AvatarCommand extends AbstractCommand {
  public keyword = "avatar";

  constructor(
    @inject(TYPES.CLIENT) private client: Client,
    @inject(TYPES.MESSAGE) private message: Message,
    @inject(TYPES.AVATAR_ERROR_HANDLER) private errorHandler: AvatarErrorHandler,
  ) {
    super();
  }

  public async execute() {
    try {
      const URL = this.message.content.split(" ")[1];
      await this.client.user?.setAvatar(URL);
      await this.message.react("✅");
    } catch (error) {
      await this.message.react("❌");
      await this.errorHandler.handle(error);
    }
  }
}
