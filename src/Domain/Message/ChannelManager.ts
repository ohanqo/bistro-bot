import { TYPES } from "@/App/AppTypes";
import { Channel, Collection, Guild, GuildMember } from "discord.js";
import { inject, injectable } from "inversify";
import { ChannelType } from "../ChannelType";

@injectable()
export default class ChannelManager {
  constructor(@inject(TYPES.GUILD) private guild: Guild) {}

  findById(id: string): Channel | undefined {
    return this.guild.channels.cache.find((channel) => channel.id === id);
  }

  async findOrCreate(name: string, type: ChannelType = "voice"): Promise<Channel> {
    const potentialChannel = this.guild.channels.cache.find((channel) => channel.name === name);
    return potentialChannel ?? (await this.guild.channels.create(name, { type }));
  }

  async moveMemberListToVoiceChannel(members: Collection<string, GuildMember>, channel: Channel) {
    return await Promise.all(members.map(async (member) => await member.voice.setChannel(channel)));
  }

  async moveMemberToVoiceChannel(member: GuildMember, channel: Channel) {
    if (member.voice.channel === null) return;
    return await member.voice.setChannel(channel);
  }
}
