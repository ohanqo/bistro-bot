import { TYPES } from "@/App/AppTypes";
import { MessageReaction, User } from "discord.js";
import { inject, injectable, multiInject } from "inversify";
import AbstractReactionManager from "./AbstractReactionManager";

@injectable()
export default class ReactionManagerFactory {
  constructor(@multiInject(TYPES.REACTION_MANAGER) private managers: AbstractReactionManager[]) {}

  public async make(): Promise<AbstractReactionManager | undefined> {
    for (let manager of this.managers) {
      if (await manager.isMatchingReactionCharacteristics()) {
        return manager;
      }
    }

    return;
  }
}
