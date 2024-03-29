import { TYPES } from "@/core/app/app.types"
import { CommandInteraction, Role, VoiceChannel } from "discord.js"
import { inject, injectable } from "inversify"
import { Repository } from "typeorm"
import JailEntity from "./jail.entity"
import { jailInfo } from "./jail.info"

@injectable()
export default class JailManager {
  constructor(
    @inject(TYPES.INTERACTION)
    private interaction: CommandInteraction,
    @inject(TYPES.JAIL_REPO)
    private jailRepository: Repository<JailEntity>
  ) {}

  public async findOrCreateJail(): Promise<VoiceChannel | undefined> {
    const guildId = this.interaction.guildId
    const jailInfo = await this.jailRepository.findOne({ where: { guildId } })
    const potentialJailChannel = this.interaction.guild?.channels.cache.find(
      (channel) => channel.id === jailInfo?.channelId
    ) as VoiceChannel | undefined
    return potentialJailChannel ?? this.createJailChannel()
  }

  public async findOrCreateRole(): Promise<Role | undefined> {
    const role = await this.interaction.guild?.findOrCreateRole(jailInfo)
    this.removePermissions(role)
    return role
  }

  public async setJailChannel(newChannelId: string) {
    let entity = await this.jailRepository.findOne({ where: { channelId: newChannelId } }) // check for existing record with the specific channel

    if (entity == null) {
      entity = JailEntity.factory(newChannelId, this.interaction.guild?.id ?? "undefined")
    } else {
      entity.channelId = newChannelId
    }

    await this.jailRepository.upsert(entity, ["guildId"])
  }

  private async createJailChannel(): Promise<VoiceChannel | undefined> {
    const channel = await this.interaction.guild?.channels.create("Jail", { type: "GUILD_VOICE" })
    const entity = JailEntity.factory(channel?.id ?? "undefined", channel?.guild?.id ?? "undefined")
    await this.jailRepository.save(entity)
    return channel
  }

  private removePermissions(role: Role | undefined) {
    role?.permissions.remove(
      "SEND_MESSAGES",
      "SPEAK",
      "CONNECT",
      "STREAM",
      "ADD_REACTIONS",
      "SEND_TTS_MESSAGES"
    )
  }
}
