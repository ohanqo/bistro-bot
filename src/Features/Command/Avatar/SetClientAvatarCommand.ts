import { TYPES } from "@/App/AppTypes";
import { Client, Message } from "discord.js";
import { inject, injectable } from "inversify";
import AbstractCommand from "../AbstractCommand";

@injectable()
export default class SetClientAvatarCommand extends AbstractCommand {
  public keyword = "avatar";

  constructor(
    @inject(TYPES.CLIENT) private client: Client,
    @inject(TYPES.MESSAGE) private message: Message,
  ) {
    super();
  }

  public async execute() {}
}
