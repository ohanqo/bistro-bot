import { TYPES } from "@/App/AppTypes";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import Validator from "./Validator";

@injectable()
export default class SenderHasEditRolePermissionValidator implements Validator {
  constructor(@inject(TYPES.MESSAGE) private message: Message) {}

  async validate(): Promise<Boolean> {
    return this.message.member?.hasPermission("MANAGE_ROLES") ?? false;
  }
}
