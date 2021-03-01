import { TYPES } from "@/App/AppTypes";
import WatcherFailureEntity from "@/Features/TaskScheduler/WebsiteWatcher/WatcherFailureEntity";
import { Client, MessageReaction } from "discord.js";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import AbstractReactionManager from "../AbstractReactionManager";

@injectable()
export default class WatcherFailureReactionManager extends AbstractReactionManager {
  constructor(
    @inject(TYPES.CLIENT)
    private client: Client,
    @inject(TYPES.REACTION)
    private reaction: MessageReaction,
    @inject(TYPES.WATCHER_FAILURE_REPOSITORY)
    private failureRepository: Repository<WatcherFailureEntity>,
  ) {
    super();
  }

  public async isMatchingReactionCharacteristics(): Promise<boolean> {
    return (
      this.reaction.message.channel.type === "dm" &&
      this.reaction.message.author.id === this.client.user?.id &&
      (await this.failureRepository.findOne({ where: { messageId: this.reaction.message.id } })) !==
        undefined
    );
  }

  public async run() {
    try {
      const failure = await this.failureRepository.findOneOrFail({
        where: { messageId: this.reaction.message.id },
      });
      await this.failureRepository.remove(failure);
      await this.reaction.message.react("✅");
    } catch (error) {
      await this.reaction.message.react("❌");
      console.log(
        `[REACTION-FAILURE-MANAGER] — Unable to delete failure with messageId: ${this.reaction.message.id}`,
        error?.message,
      );
    }
  }
}
