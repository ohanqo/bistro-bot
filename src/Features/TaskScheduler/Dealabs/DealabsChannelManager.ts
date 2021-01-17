import { TYPES } from "@/App/AppTypes";
import { Client, Guild, GuildChannel, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import DealabsChannelEntity from "./DealabsChannelEntity";

@injectable()
export default class DealabsChannelManager {
  constructor(
    @inject(TYPES.CLIENT)
    private client: Client,
    @inject(TYPES.DEALABS_CHANNEL_REPOSITORY)
    private dealabsChannelRepository: Repository<DealabsChannelEntity>,
  ) {}

  public async findOrCreateDealChannels(): Promise<TextChannel[]> {
    let textChannels: TextChannel[] = [];

    try {
      const delabsChannels = await this.dealabsChannelRepository.find();
      const alreadyRegisteredChannelsIds = delabsChannels.map((channel) => channel.channelId);
      textChannels = await this.findOrCreateChannelForClientGuilds(alreadyRegisteredChannelsIds);
    } catch (error) {
      console.error(
        "[DEALABS] — An error as occurred while retrieving channels from database…",
        error,
      );
    } finally {
      return textChannels;
    }
  }

  private async findOrCreateChannelForClientGuilds(
    alreadyRegisteredChannelsIds: string[],
  ): Promise<TextChannel[]> {
    return (await Promise.all(
      this.client.guilds.cache.map(async (guild) => {
        const potentialChannel = this.findMatchingChannel(guild, alreadyRegisteredChannelsIds);
        return potentialChannel ?? (await this.createAndStoreNewDealChannel(guild));
      }),
    )) as TextChannel[];
  }

  private async createAndStoreNewDealChannel(guild: Guild): Promise<GuildChannel> {
    const channel = await guild.channels.create("deals", { type: "text" });
    const channelEntity = new DealabsChannelEntity();

    channelEntity.channelId = channel.id;
    channelEntity.guildId = guild.id;
    await this.dealabsChannelRepository.save(channelEntity);

    return channel;
  }

  private findMatchingChannel(
    guild: Guild,
    alreadyRegisteredChannelsIds: string[],
  ): GuildChannel | undefined {
    return guild.channels.cache.find((channel) =>
      alreadyRegisteredChannelsIds.some(
        (alreadyRegisteredChannel) => alreadyRegisteredChannel === channel.id,
      ),
    );
  }
}
