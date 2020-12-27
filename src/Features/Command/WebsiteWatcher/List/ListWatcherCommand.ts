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
    const watcherList = await this.websiteWatcherRepository.find({ channelId, authorId });

    if (watcherList.length === 0) {
      await this.message.reply("tu n'as aucun watcher d'enregistré…");
    } else {
      await this.sendWatcherListMessage(watcherList);
    }
  }

  private async sendWatcherListMessage(watcherList: WebsiteWatcherEntity[]) {
    const recordsJoined = watcherList.map(({ id, url, querySelector }) => {
      return `ID: \`${id}\` |  URL: <${url}> | QuerySelector: \`${querySelector}\` \n \n`;
    });
    await this.message.reply(`\n${recordsJoined.join("")}`);
  }
}
