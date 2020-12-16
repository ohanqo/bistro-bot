import AppState from "@/App/AppState";
import { TYPES } from "@/App/AppTypes";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import Validator from "./Validator";

@injectable()
export default class TargetAreInJailValidator implements Validator {
  constructor(
    @inject(TYPES.STATE) private state: AppState,
    @inject(TYPES.MESSAGE) private message: Message,
  ) {}

  async validate(): Promise<Boolean> {
    const mentions = this.message.mentions.members;
    const jailedMembers = this.state.jailedMembers;

    return (
      mentions?.every((member) => jailedMembers.some((jm) => jm.memberId === member.id)) ?? true
    );
  }
}
