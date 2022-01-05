import {
  Client,
  CreateRoleOptions,
  Guild,
  GuildMember,
  Role,
  TextChannel,
  VoiceChannel
} from "discord.js"

declare module "discord.js" {
  interface GuildMember {
    isInVoiceChannel: () => boolean
    moveToChannel: (channel: VoiceChannel) => Promise<void>
    getRoles: () => Role[]
    replaceRoles: (...role: Role[]) => Promise<void>
  }

  interface Guild {
    findOrCreateRole: (data: CreateRoleOptions) => Promise<Role>
  }

  interface Client {
    findChannel: (guildId: string, channelId: string) => TextChannel | undefined
    findMember: (guildId: string, memberId: string) => GuildMember | undefined
  }
}

GuildMember.prototype.isInVoiceChannel = function () {
  return this.voice.channel !== null
}

GuildMember.prototype.moveToChannel = async function (channel: VoiceChannel) {
  if (this.isInVoiceChannel()) await this.voice.setChannel(channel)
}

GuildMember.prototype.getRoles = function () {
  return this.roles.cache.filter((role) => role.name !== "@everyone").map((role) => role)
}

GuildMember.prototype.replaceRoles = async function (...roles: Role[]) {
  // remove all roles
  await Promise.all(this.getRoles().map(async (role) => await this.roles.remove(role.id)))

  // apply all roles
  if (roles !== undefined) {
    await Promise.all(roles.map(async (role) => await this.roles.add(role)))
  }
}

Guild.prototype.findOrCreateRole = async function (data: CreateRoleOptions) {
  const potentialRole = this.roles.cache.find((role) => role.name === data.name)
  return potentialRole ?? (await this.roles.create(data))
}

Client.prototype.findChannel = function (guildId: string, channelId: string) {
  const potentialGuild = this.guilds.cache.find((guild) => guild.id === guildId)
  return potentialGuild?.channels.cache.find((channel) => channel.id === channelId) as TextChannel
}

Client.prototype.findMember = function (guildId: string, memberId: string) {
  const potentialGuild = this.guilds.cache.find((guild) => guild.id === guildId)
  return potentialGuild?.members.cache.find((member) => member.id === memberId)
}

export {}
