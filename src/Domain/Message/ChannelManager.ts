import { TYPES } from "@/App/AppTypes";
import { Channel, Collection, Guild, GuildMember } from "discord.js";
import { inject, injectable } from "inversify";
import { ChannelType } from "../ChannelType";
import Constant from "../Constant";

@injectable()
export default class ChannelManager {
  constructor(
    @inject(TYPES.GUILD) private guild: Guild,
    @inject(TYPES.CONSTANT) private constant: Constant,
  ) {}

  findById(id: string): Channel | undefined {
    return this.guild.channels.cache.find((channel) => channel.id === id);
  }

  async findOrCreate(id: string, type: ChannelType = "voice"): Promise<Channel> {
    const potentialChannel = this.findById(id);
    return (
      potentialChannel ??
      (await this.guild.channels.create(this.constant.JAIL_CHANNEL_NAME, { type }))
    );
  }

  async moveMemberListToVoiceChannel(members: Collection<string, GuildMember>, channel: Channel) {
    return await Promise.all(
      members.map(async (member) => await this.moveMemberToVoiceChannel(member, channel)),
    );
  }

  async moveMemberToVoiceChannel(member: GuildMember, channel: Channel) {
    if (member.voice.channel === null) return;
    console.log(`[CHANNEL-MANAGER] — Move ${member.nickname} to channel id ${channel.id}`);
    return await member.voice.setChannel(channel);
  }
}
