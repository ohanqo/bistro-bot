import { CreateRoleOptions, Guild, GuildMember, Role, VoiceChannel } from "discord.js"

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

export {}
