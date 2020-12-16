import { TYPES } from "@/App/AppTypes";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import Validator from "./Validator";

@injectable()
export default class TargetsAreNotAdminValidator implements Validator {
  constructor(@inject(TYPES.MESSAGE) private message: Message) {}

  async validate(): Promise<Boolean> {
    const mentions = this.message.mentions.members;

    return !mentions?.some((member) => member.hasPermission("ADMINISTRATOR")) ?? true;
  }
}
