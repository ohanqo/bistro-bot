import { TYPES } from "@/App/AppTypes";
import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import AbstractCommand from "../../AbstractCommand";
import WebsiteWatcherEntity from "../WebsiteWatcherEntity";

@injectable()
export default class ListWatcherCommand extends AbstractCommand {
  public keyword = "watch:list";

  constructor(
    @inject(TYPES.MESSAGE)
    private message: Message,
    @inject(TYPES.WEBSITE_WATCHER_REPOSITORY)
    private websiteWatcherRepository: Repository<WebsiteWatcherEntity>,
  ) {
    super();
  }

  public async execute() {
    const channelId = this.message.channel.id;
    const authorId = this.message.author.id;
    const records = await this.websiteWatcherRepository.find({ channelId, authorId });
    const recordsJoined = records.map(({ id, url, querySelector }) => {
      return `ID: ${id} |  URL: <${url}> | QuerySelector: ${querySelector} \n`;
    });
    await this.message.reply(`\n${recordsJoined}`);
  }
}
