import { TYPES } from "@/App/AppTypes";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import AbstractCommand from "../../AbstractCommand";
import AddWatcherArgumentValidator from "./AddWatcherArgumentValidator";
import WebsiteWatcherEntity from "../WebsiteWatcherEntity";
import AddWatcherIntegrityCheck from "./AddWatcherIntegrityCheck";

@injectable()
export default class AddWatcherCommand extends AbstractCommand {
  public keyword = "watch";

  constructor(
    @inject(TYPES.MESSAGE)
    private message: Message,
    @inject(TYPES.ADD_WATCHER_ARGS_VALIDATOR)
    argsValidator: AddWatcherArgumentValidator,
    @inject(TYPES.ADD_WATCHER_INTEGRITY_CHECK)
    private integrityChecker: AddWatcherIntegrityCheck,
    @inject(TYPES.WEBSITE_WATCHER_REPOSITORY)
    private websiteWatcherRepository: Repository<WebsiteWatcherEntity>,
  ) {
    super();
    this.validators = [argsValidator];
  }

  public async execute() {
    await this.message.react("⏳");

    if (await this.integrityChecker.check()) {
      const entity = this.mapArgumentsToWebsiteWatcherEntity();
      await this.websiteWatcherRepository.save(entity);
      await this.message.react("✅");
    } else {
      await this.message.react("❌");
    }
  }

  private mapArgumentsToWebsiteWatcherEntity(): WebsiteWatcherEntity {
    const entity = new WebsiteWatcherEntity();
    const content = this.message.content;

    entity.url = content.split(" ")[1];
    entity.querySelector = content.inQuoteContent()?.toString() ?? "";
    entity.guildId = this.message.guild?.id ?? "";
    entity.channelId = this.message.channel.id;
    entity.authorId = this.message.author.id;

    return entity;
  }
}
