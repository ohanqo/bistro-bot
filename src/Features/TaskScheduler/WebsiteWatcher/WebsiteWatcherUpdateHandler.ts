import { TYPES } from "@/App/AppTypes";
import WebsiteWatcherEntity from "@/Features/Command/WebsiteWatcher/WebsiteWatcherEntity";
import { Client, GuildChannel, GuildChannelManager, TextChannel } from "discord.js";
import { watch } from "fs";
import { inject, injectable } from "inversify";
import { Page } from "puppeteer";
import { Repository } from "typeorm";
import WebsiteWatcherMessageBuilder from "./WebsiteWatcherMessageBuilder";

@injectable()
export default class WebsiteWatcherUpdateHandler {
  constructor(
    @inject(TYPES.CLIENT)
    private client: Client,
    @inject(TYPES.WEBSITE_WATCHER_MESSAGE_BUILDER)
    private messageBuilder: WebsiteWatcherMessageBuilder,
    @inject(TYPES.WEBSITE_WATCHER_REPOSITORY)
    private websiteWatcherRepository: Repository<WebsiteWatcherEntity>,
  ) {}

  public async handleUpdate(page: Page, watcher: WebsiteWatcherEntity, outerHTML: string) {
    try {
      await this.websiteWatcherRepository.update(watcher.id, { outerHTML });
      await this.publishMessage(page, watcher);
    } catch (error) {
      console.error("[UPDATE-HANDLER] — An error as occurred…", error);
    }
  }

  private async publishMessage(page: Page, watcher: WebsiteWatcherEntity) {
    const channel = this.findChannel(watcher);
    const message = await this.messageBuilder.build(page, watcher);
    await channel.send(message);
  }

  private findChannel({ guildId, channelId }: WebsiteWatcherEntity): TextChannel {
    const guild = this.client.guilds.cache.find((guild) => guild.id === guildId);
    const channel = guild?.channels.cache.find((channel) => channel.id === channelId);

    if (!channel) {
      throw new Error(
        `Unable to find channel with guildId: ${guildId} and channelId: ${channelId}…`,
      );
    }

    return channel as TextChannel;
  }
}
